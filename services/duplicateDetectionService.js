const stringSimilarity = require('string-similarity');
const Report = require('../models/Report');

const findDuplicate = async (category, location, newDescription) => {
    try {
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        // Query existing reports with the same category within the last 24 hours
        const recentReports = await Report.find({
            category: category,
            createdAt: { $gte: twentyFourHoursAgo }
        });

        if (recentReports.length === 0) {
            return { possibleDuplicate: false, matchedReportId: null };
        }

        let bestMatchScore = 0;
        let matchedReportId = null;

        for (const report of recentReports) {
            const score = stringSimilarity.compareTwoStrings(newDescription, report.description);
            if (score > bestMatchScore) {
                bestMatchScore = score;
                matchedReportId = report._id;
            }
        }

        // Return if a match is 0.6 or higher
        if (bestMatchScore >= 0.6) {
            return { possibleDuplicate: true, matchedReportId: matchedReportId };
        }

        return { possibleDuplicate: false, matchedReportId: null };
    } catch (error) {
        console.error("Error in duplicate detection:", error);
        // Fail gracefully to not block report creation
        return { possibleDuplicate: false, matchedReportId: null };
    }
};

module.exports = {
    findDuplicate
};
