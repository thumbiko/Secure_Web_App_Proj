//connecting  backend to MongoDB
//database connection

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Connect to MongoDB using environment variable
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection failed:", error.message);

    // Stop the server if DB fails (important for safety)
    process.exit(1);
  }
};

module.exports = connectDB;