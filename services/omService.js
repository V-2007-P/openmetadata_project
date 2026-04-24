const axios = require('axios');
require('dotenv').config();

// Create a specialized client for OpenMetadata
const omClient = axios.create({
    baseURL: process.env.OM_URL,
    headers: {
        'Authorization': `Bearer ${process.env.OM_JWT_TOKEN}`,
        'Content-Type': 'application/json'
    }
});

/**
 * FEATURE: LINEAGE FORENSICS (Point 2)
 * Finds which downstream assets will "break" if this entity has an issue.
 */
const getDownstreamImpact = async (entityId) => {
    try {
        // We query the lineage endpoint to see what follows this table
        const response = await omClient.get(`/lineage/table/${entityId}?upstreamDepth=0&downstreamDepth=2`);
        
        // Extract the names of impacted dashboards or tables
        const downstreamNodes = response.data.nodes
            .filter(node => node.id !== entityId) // Don't include the asset itself
            .map(node => node.displayName || node.name);

        return downstreamNodes.length > 0 ? downstreamNodes : ["No immediate downstream impact detected"];
    } catch (error) {
        console.error("Lineage Fetch Failed:", error.message);
        return ["Unknown Impact"];
    }
};

/**
 * FEATURE: GOVERNANCE LOOKUP (Point 2)
 * Identifies the human responsible for this data.
 */
const getAssetOwner = async (entityType, entityId) => {
    try {
        // OpenMetadata stores owners in the entity detail
        const response = await omClient.get(`/${entityType}s/${entityId}?fields=owner`);
        return response.data.owner?.displayName || response.data.owner?.name || "Unassigned Steward";
    } catch (error) {
        return "Community Owned";
    }
};

module.exports = { getDownstreamImpact, getAssetOwner };