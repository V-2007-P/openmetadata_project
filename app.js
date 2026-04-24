require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');


// Import Routes
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const webhookRoutes = require('./routes/webhookRoutes');

const app = express();
connectDB();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Use Routes
app.use('/', authRoutes);
app.use('/', dashboardRoutes);
app.use('/', webhookRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`VAANI running on http://localhost:${PORT}`));