const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    id: { type: String, unique: true, sparse: true },
    name: { type: String },
    contact: { type: String },
    location: { type: String, required: true },
    description: { type: String, required: true },
    language: { type: String },
    category: { type: String },
    urgency: { type: String },
    summary: { type: String },
    suggestedAction: { type: String },
    confidence: { type: Number },
    possibleDuplicate: { type: Boolean, default: false },
    matchedReportId: { type: String },
    status: { type: String, default: 'pending' }
}, {
    timestamps: true
});

module.exports = mongoose.model('Report', ReportSchema);
