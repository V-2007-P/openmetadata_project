const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const humanizeAlert = async (context) => {
    try {
        // UPDATED MODEL NAME FOR 2026
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

        const impactList = (context.impact && context.impact.length > 0) 
            ? context.impact.join(', ') 
            : "No immediate downstream impact detected";

        const prompt = `
            Context: You are VAANI, an AI Data Steward.
            Asset: ${context.asset}
            Event: ${context.event}
            Owner: ${context.owner}
            Downstream Impact: ${impactList}

            Task: Write a 2-sentence update for the team. 
            Tone: Professional but urgent if impact is high. 
            Instruction: Mention if the owner needs to take action and highlight which dashboards are at risk.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini Error:", error);
        return "⚠️ Data Alert: An update occurred in " + context.asset + ". Check VAANI dashboard for details.";
    }
};

module.exports = { humanizeAlert };