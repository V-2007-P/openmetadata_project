const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
    eventType: String,        // e.g., entityCreated, entityUpdated
    entityName: String,       // The name of the table or pipeline
    rawMetadata: Object,      // STORES THE ENTIRE OPENMETADATA JSON
    aiSummary: String,        // Gemini's simplified version
    impactedAssets: Array,    // From Lineage API
    owner: String,            // From User API
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Alert', AlertSchema);