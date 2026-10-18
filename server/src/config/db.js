const mongoose = require("mongoose");

/**
 * Connect to MongoDB using Mongoose.
 * Exits or rejects if connection fails without fabricating a connected state.
 */
const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error("MongoDB Connection Error: MONGO_URI is not defined in environment variables.");
    return null;
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
