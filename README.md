<h1>🔥⚡️VAANI: AI-Powered Governance & Observability for OpenMetadata</h1>

VAANI (Vocalized AI-driven Alerting & Notification Interface) is an intelligent observability layer designed to bridge the gap between raw metadata signals and actionable data governance. Built for the OpenMetadata x WeMakeDevs Hackathon 2026, VAANI transforms complex technical "ChangeEvents" from OpenMetadata into human-readable insights using Generative AI.

<h3>🚀 Live Demo & Deployment</h3>
Live Application: (https://openmetadata-project.onrender.com)

Demo Video: (https://youtu.be/dmvxQPO292A?si=MoFGSNJbckhuMQvC)

<h3>🔗 The OpenMetadata Integration</h3>
VAANI is not just a standalone tool; it is a specialized extension for the OpenMetadata ecosystem.

1. Event-Driven Architecture (Webhooks)
VAANI integrates directly with OpenMetadata’s Webhook system. It acts as a listener for ChangeEvents. When a schema is modified, a description is updated, or ownership is changed in OpenMetadata, VAANI intercepts the JSON payload in real-time.

2. Entity History Analysis
Instead of treating alerts as isolated incidents, VAANI utilizes the OpenMetadata Entity History. It analyzes the "Before" and "After" states of metadata to determine the severity of a change, ensuring that data stewards focus on critical drifts rather than minor updates.

3. AI-Augmented Governance
By passing OpenMetadata’s technical metadata to Gemini 3 Flash, VAANI provides:

Impact Analysis: Automatically calculates the downstream risk of a schema change.

Smart Summarization: Converts complex JSON diffs into plain English for non-technical stakeholders.

Proactive Ownership: Extracts owner information from the OpenMetadata registry to route alerts automatically.

<h3>🛠️ Tech Stack</h3>
Frontend: EJS (Embedded JavaScript), CSS3, JavaScript (ES6+)

Backend: Node.js, Express.js

Database: MongoDB Atlas (for persistent Governance Audit Trails)

AI Engine: Google Gemini 3 Flash

Integration: OpenMetadata Webhooks & APIs

Communication: Nodemailer (SMTP Integration for automated alerting)

<h3>✨ Key Features</h3>
Real-time Webhook Listener: Captures live signals from OpenMetadata.

AI Governance Cards: Dynamic UI cards that summarize metadata risks.

Governance History Timeline: A persistent audit trail of every metadata change, allowing users to "travel through time" and see the evolution of their data assets.

Automated Notification Loop: Instant AI-summarized emails sent to data owners identified within OpenMetadata.

Simulation Engine: A built-in feature for judges to simulate OpenMetadata signals and see the AI logic in action immediately.

<h3>⚙️ Installation & Setup</h3>
Clone the repository:

Bash
git clone https://github.com/V-2007-P/openmetadata_project.git
cd vaani-observability
Install dependencies:

Bash
npm install
Environment Variables:
Create a .env file (refer to .env.example) and add your credentials:

MONGO_URI: Your MongoDB Atlas connection string.

GEMINI_API_KEY: Your Google AI Studio key.

EMAIL_USER & EMAIL_PASS: For automated notifications.

PORT: 3000 or 10000.

Run locally:
Bash
npm start

<h3>🛡️ Governance Impact</h3>
VAANI moves the needle for OpenMetadata users by solving Alert Fatigue. Instead of hundreds of raw notifications, users receive context. It turns a "Metadata Repository" into an "Active Governance Center."
