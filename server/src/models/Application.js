const mongoose = require("mongoose");

// Preserve the CV as submitted: later edits must not alter the employer's record.
const cvItemSchema = new mongoose.Schema({
  title: { type: String, maxlength: 160 },
  organization: { type: String, maxlength: 160 },
  period: { type: String, maxlength: 90 },
  details: { type: String, maxlength: 3000 },
  url: { type: String, maxlength: 400 },
}, { _id: false });
const cvSnapshotSchema = new mongoose.Schema({
  name: { type: String, maxlength: 80 },
  headline: { type: String, maxlength: 180 },
  summary: { type: String, maxlength: 3000 },
  skills: { type: [String], default: [] },
  education: { type: [cvItemSchema], default: [] },
  experience: { type: [cvItemSchema], default: [] },
  projects: { type: [cvItemSchema], default: [] },
}, { _id: false });

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
    cv: { type: mongoose.Schema.Types.ObjectId, ref: "Cv", default: null },
    cvSnapshot: { type: cvSnapshotSchema, default: null },
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
