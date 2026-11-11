const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const helmet = require("helmet");
const { rateLimit } = require("express-rate-limit");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const companyRoutes = require("./routes/companyRoutes");
const adminRoutes = require("./routes/adminRoutes");
const employerRoutes = require("./routes/employerRoutes");
const savedJobRoutes = require("./routes/savedJobRoutes");
const cvRoutes = require("./routes/cvRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const contactRoutes = require("./routes/contactRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();
app.disable("x-powered-by");
// Vercel/Render traffic arrives via one trusted reverse proxy hop.
app.set("trust proxy", 1);
app.use(helmet());
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 25,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { success: false, message: "Too many attempts. Please try again in 15 minutes." },
});

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
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: false, limit: "100kb" }));
app.use(cookieParser());
// Authenticated mutations require the expected website Origin. A cross-site
// request must not be allowed to spend an HTTP-only authentication cookie.
app.use((req, res, next) => {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method) || !req.cookies?.token) return next();
  if (req.get("sec-fetch-site") === "cross-site") {
    return res.status(403).json({ success: false, message: "Cross-site requests are not permitted." });
  }
  const origin = req.get("origin");
  if (origin && !allowedOrigins.includes(origin) && process.env.NODE_ENV === "production") {
    return res.status(403).json({ success: false, message: "Request origin not permitted." });
  }
  next();
});
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api/auth/forgot-password", authLimiter);
app.use("/api/auth/change-password", authLimiter);

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
app.use("/api/employer", employerRoutes);
app.use("/api/saved-jobs", savedJobRoutes);
app.use("/api/cvs", cvRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/contact", contactRoutes);

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