const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Internship title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [150, "Title cannot exceed 150 characters"],
      index: true,
    },
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      default: null,
    },
    category: {
      type: String,
      enum: {
        values: ["IT", "Marketing", "Finance", "Engineering", "Other"],
        message: "{VALUE} is not a valid category",
      },
      default: "IT",
      index: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: {
        values: ["Full Time", "Part Time", "Remote", "Hybrid"],
        message: "{VALUE} is not a valid internship type",
      },
      default: "Full Time",
      index: true,
    },
    duration: {
      type: String,
      trim: true,
      default: "3 Months",
    },
    deadline: {
      type: Date,
      default: null,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    requirements: {
      type: String,
      trim: true,
      default: "",
    },
    skills: {
      type: [String],
      default: [],
    },
    salary: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: {
        values: ["Active", "Pending", "Closed", "Expired"],
        message: "{VALUE} is not a valid post status",
      },
      default: "Active",
      index: true,
    },
    applicationsCount: {
      type: Number,
      default: 0,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for category and status filtering
jobSchema.index({ category: 1, status: 1 });
jobSchema.index({ createdAt: -1 });

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
