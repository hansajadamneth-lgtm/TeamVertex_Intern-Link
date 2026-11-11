const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const companyRoutes = require("./routes/companyRoutes");
const adminRoutes = require("./routes/adminRoutes");
const cvRoutes = require("./routes/cvRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

// Core middleware
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((url) => url.trim())
  : ["http://localhost:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Database connection
connectDB().catch((err) => {
  console.warn("MongoDB connection warning:", err.message);
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  const databaseConnected = mongoose.connection.readyState === 1;
  res.set("Cache-Control", "no-store");
  res.status(databaseConnected ? 200 : 503).json({
    status: databaseConnected ? "ok" : "degraded",
    message: databaseConnected
      ? "InternLink API and MongoDB are connected"
      : "InternLink API is running but MongoDB is not connected",
    database: databaseConnected ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

// Mount resource routers
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/cvs", cvRoutes);
app.use("/api/recommendations", recommendationRoutes);

// 404 & Centralized Error Handlers (registered after all routes)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;