const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student reference is required"],
      index: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: [true, "Job reference is required"],
      index: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      default: null,
    },
    companyName: {
      type: String,
      trim: true,
      default: "",
    },
    position: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: {
        values: [
          "Interview scheduled",
          "Under review",
          "Application sent",
          "Rejected",
          "Accepted",
        ],
        message: "{VALUE} is not a valid application status",
      },
      default: "Application sent",
      index: true,
    },
    fitScore: {
      type: Number,
      min: [0, "Fit score cannot be negative"],
      max: [100, "Fit score cannot exceed 100"],
      default: 80,
    },
    resumeUrl: {
      type: String,
      default: "",
    },
    coverLetter: {
      type: String,
      default: "",
    },
    action: {
      type: String,
      enum: ["View Invite", "Details Pending", "Download Copy"],
      default: "Download Copy",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent multiple applications by same student for the same job
applicationSchema.index({ student: 1, job: 1 }, { unique: true });
applicationSchema.index({ createdAt: -1 });

const Application = mongoose.model("Application", applicationSchema);

module.exports = Application;
