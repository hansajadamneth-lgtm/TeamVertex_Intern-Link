const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
  subject: { type: String, required: true, trim: true, maxlength: 160 },
  message: { type: String, required: true, trim: true, maxlength: 3000 },
}, { timestamps: true });

contactSchema.index({ createdAt: -1 });
module.exports = mongoose.model("Contact", contactSchema);
