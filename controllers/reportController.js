const { validationResult } = require('express-validator');
const Report = require('../models/Report');
const aiService = require('../services/aiService');
const duplicateDetectionService = require('../services/duplicateDetectionService');

exports.createReport = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMsg = errors.array().map(e => e.msg).join(' ');
        return res.status(400).json({ success: false, message: errorMsg });
    }

    try {
        const { description, location, language } = req.body;

        let aiData;
        try {
            aiData = await aiService.classifyReport(description, location, language);
        } catch (aiError) {
            return res.status(500).json({ success: false, message: "AI classification failed. Please try again." });
        }

        const duplicateResult = await duplicateDetectionService.findDuplicate(aiData.category, location, description);

        const mergedData = {
            ...req.body,
            category: aiData.category,
            urgency: aiData.urgency,
            summary: aiData.summary,
            suggestedAction: aiData.suggestedAction,
            confidence: aiData.confidence,
            possibleDuplicate: duplicateResult.possibleDuplicate,
            matchedReportId: duplicateResult.matchedReportId
        };

        const report = new Report(mergedData);
        await report.save();
        res.status(201).json({ success: true, message: 'Report created successfully', data: report });
    } catch (error) {
        console.error('Error creating report:', error);
        res.status(500).json({ success: false, message: 'Server error while creating report' });
    }
};

exports.getStatsSummary = async (req, res) => {
    try {
        const totalReports = await Report.countDocuments();
        
        const pipeline = [
            {
                $facet: {
                    statusBreakdown: [
                        { $group: { _id: "$status", count: { $sum: 1 } } }
                    ],
                    categoryBreakdown: [
                        { $group: { _id: "$category", count: { $sum: 1 } } }
                    ],
                    urgencyBreakdown: [
                        { $group: { _id: "$urgency", count: { $sum: 1 } } }
                    ]
                }
            }
        ];
        
        const result = await Report.aggregate(pipeline);
        const facetData = result[0];
        
        const getCount = (arr, id) => {
            const item = arr.find(x => x._id === id);
            return item ? item.count : 0;
        };

        const criticalReports = getCount(facetData.urgencyBreakdown, 'critical');
        const pendingReports = getCount(facetData.statusBreakdown, 'pending');
        const resolvedReports = getCount(facetData.statusBreakdown, 'resolved');
        
        const formatBreakdown = (arr) => {
            const obj = {};
            arr.forEach(item => {
                if (item._id) obj[item._id] = item.count;
            });
            return obj;
        };

        const responseData = {
            totalReports,
            criticalReports,
            pendingReports,
            resolvedReports,
            categoryBreakdown: formatBreakdown(facetData.categoryBreakdown),
            urgencyBreakdown: formatBreakdown(facetData.urgencyBreakdown)
        };
        
        res.status(200).json({ success: true, data: responseData });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching stats summary' });
    }
};

exports.getReports = async (req, res) => {
    try {
        const { category, urgency, status, startDate, endDate, search } = req.query;
        let query = {};

        if (category) query.category = category;
        if (urgency) query.urgency = urgency;
        if (status) query.status = status;
        
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        if (search) {
            query.$or = [
                { description: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } }
            ];
        }

        const reports = await Report.find(query).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: reports });
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching reports' });
    }
};

exports.getReportById = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ success: false, message: "Report not found." });
        }
        res.status(200).json({ success: true, data: report });
    } catch (error) {
        console.error('Error fetching report by ID:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching report' });
    }
};

exports.updateReportStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['pending', 'in_review', 'assigned', 'resolved', 'rejected'];
        
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
        }

        const report = await Report.findByIdAndUpdate(req.params.id, { status }, { new: true });
        
        if (!report) {
            return res.status(404).json({ success: false, message: "Report not found." });
        }
        
        res.status(200).json({ success: true, data: report, message: "Report status updated successfully" });
    } catch (error) {
        console.error('Error updating report status:', error);
        res.status(500).json({ success: false, message: 'Server error while updating report status' });
    }
};

exports.deleteReport = async (req, res) => {
    try {
        const report = await Report.findByIdAndDelete(req.params.id);
        if (!report) {
            return res.status(404).json({ success: false, message: "Report not found." });
        }
        res.status(200).json({ success: true, message: "Report deleted successfully" });
    } catch (error) {
        console.error('Error deleting report:', error);
        res.status(500).json({ success: false, message: 'Server error while deleting report' });
    }
};
