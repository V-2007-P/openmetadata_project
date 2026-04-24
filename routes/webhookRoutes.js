const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');
const { humanizeAlert } = require('../services/aiService');
const { getDownstreamImpact, getAssetOwner } = require('../services/omService');

/**
 * @route   POST /webhook
 * @desc    Receives events from OpenMetadata, enriches with Lineage/Governance, 
 * and processes with Gemini AI.
 */
router.post('/webhook', async (req, res) => {
    try {
        // The raw JSON sent by OpenMetadata
        const omData = req.body;
        
        // Extracting basic info (Safe navigation with optional chaining)
        const entityId = omData.entityId;
        const entityType = omData.entityType;
        const entityName = omData.entity?.name || "Unknown Asset";

        console.log(`--- New Webhook Received: ${omData.eventType} on ${entityName} ---`);

        // 1. DEEP LEVERAGE (Point 2): Fetch Lineage & Governance context
        // We fetch who owns the data and what other tables will break (Impact)
        let impact = [];
        let owner = "Unassigned";

        if (entityId) {
            impact = await getDownstreamImpact(entityId);
            owner = await getAssetOwner(entityType, entityId);
        }

        // 2. AI ENRICHMENT (Point 3): Send rich context to Gemini
        // We don't just send the error; we tell Gemini who owns it and what's at stake.
        const aiContext = {
            event: omData.eventType,
            asset: entityName,
            change: omData.changeDescription,
            owner: owner,
            impact: impact
        };

        const summary = await humanizeAlert(aiContext);

        // 3. PERSISTENCE: Save the enriched alert to MongoDB
        const newAlert = new Alert({
            eventType: omData.eventType,
            entityName: entityName,
            owner: owner,
            impactedAssets: impact,
            aiSummary: summary,
            rawMetadata: omData, // Keep the original JSON for debugging
            createdAt: new Date()
        });

        await newAlert.save();

        console.log("✅ Alert Processed and Humanized by Gemini.");

        // Return 200 to OpenMetadata so it knows the webhook was successful
        res.status(200).send({ message: "VAANI processed event successfully" });

    } catch (err) {
        console.error("❌ Webhook Processing Error:", err.message);
        // Even if AI fails, we acknowledge the webhook to avoid retries from OM
        res.status(500).send({ error: "Internal Server Error" });
    }
});

module.exports = router;