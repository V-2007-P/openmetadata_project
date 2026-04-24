const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // No options needed anymore! Just the URI.
        const conn = await mongoose.connect(process.env.MONGO_URI);
        
        console.log(`MongoDB Connected: ${conn.connection.host} 🚀`);
    } catch (err) {
        console.error(`Database Connection Error: ${err.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;