const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');
const nodemailer = require('nodemailer');

router.get('/dashboard', async (req, res) => {
    try {
        const alerts = await Alert.find().sort({ createdAt: -1 });
        res.render('dashboard', { alerts });
    } catch (err) {
        res.status(500).send("Error loading dashboard");
    }
});

// ADD THIS NEW ROUTE HERE
// router.get('/asset/:id', async (req, res) => {
//     try {
//         const alert = await Alert.findById(req.params.id);
//         if (!alert) return res.redirect('/dashboard');
        
//         // Ensure the file name matches your .ejs file exactly
//         res.render('assetDetail', { alert }); 
//     } catch (err) {
//         console.error(err);
//         res.redirect('/dashboard');
//     }
// });
router.get('/asset/:id', async (req, res) => {
    try {
        const currentAlert = await Alert.findById(req.params.id);
        if (!currentAlert) return res.redirect('/dashboard');

        // GOVERNANCE FEATURE: Find previous history for this same asset
        const history = await Alert.find({ 
            entityName: currentAlert.entityName,
            _id: { $ne: currentAlert._id } // Don't include the current one in history
        }).sort({ createdAt: -1 }).limit(3);

        res.render('assetDetail', { 
            alert: currentAlert, 
            history: history 
        }); 
    } catch (err) {
        console.error(err);
        res.redirect('/dashboard');
    }
});

// Add this below the asset route
router.post('/alert/delete/:id', async (req, res) => {
    try {
        await Alert.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Delete failed" });
    }
});

// Handle the "Notify" request
router.post('/alert/notify/:id', async (req, res) => {
    try {
        const alert = await Alert.findById(req.params.id);
        if (!alert) return res.status(404).json({ error: "Alert not found" });

        // 1. Create Transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // 2. Define Email Content
        const mailOptions = {
            from: `"VAANI AI" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER, // For demo, send it to yourself
            subject: `🚨 VAANI Alert: Issue in ${alert.entityName}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px;">
                    <h2 style="color: #a855f7;">✨ VAANI Governance Report</h2>
                    <p>An observability signal was detected for asset: <strong>${alert.entityName}</strong></p>
                    <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #a855f7;">
                        <strong>AI Analysis:</strong> ${alert.aiSummary}
                    </div>
                    <p style="margin-top: 20px; font-size: 0.8rem; color: #64748b;">
                        Root Cause: ${alert.eventType} in OpenMetadata Sandbox.
                    </p>
                </div>
            `
        };

        // 3. Send
        await transporter.sendMail(mailOptions);
        res.json({ success: true });

    } catch (err) {
        console.error("Email Error:", err);
        res.status(500).json({ error: "Mail failed to send" });
    }
});

module.exports = router;