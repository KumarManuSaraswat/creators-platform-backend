require('dotenv').config(); // Load environment variables from your .env file
const mongoose = require('mongoose');
const app = require('./app'); // Import your Express app instance

// Set the port from environment variables or default to 5000
const PORT = process.env.PORT || 5000;

// Use your main database connection string for development/production
const DB_URI = process.env.MONGODB_URI;

// 1. Connect to MongoDB
mongoose.connect(DB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB (Development/Production)');
    
    // 2. Start the server ONLY after the database connection is successful
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Database connection error:', err.message);
    process.exit(1); // Stop the application if the database fails to connect
  });