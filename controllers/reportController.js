const { validationResult } = require('express-validator');
const Report = require('../models/Report');
const aiService = require('../services/aiService');

exports.createReport = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { description, location, language } = req.body;

        let aiData;
        try {
            aiData = await aiService.classifyReport(description, location, language);
        } catch (aiError) {
            return res.status(500).json({ success: false, message: "AI classification failed. Please try again." });
        }

        const mergedData = {
            ...req.body,
            category: aiData.category,
            urgency: aiData.urgency,
            summary: aiData.summary,
            suggestedAction: aiData.suggestedAction,
            confidence: aiData.confidence
        };

        const report = new Report(mergedData);
        await report.save();
        res.status(201).json({ message: 'Report created successfully', report });
    } catch (error) {
        console.error('Error creating report:', error);
        res.status(500).json({ error: 'Server error while creating report' });
    }
};
