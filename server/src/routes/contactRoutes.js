const router = require("express").Router();
const { rateLimit } = require("express-rate-limit");
const Contact = require("../models/Contact");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

const submitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { success: false, message: "Too many contact requests. Please try again later." },
});

router.post("/", submitLimiter, async (req, res, next) => {
  try {
    const { fullName, email, subject, message } = req.body || {};
    if ([fullName, email, subject, message].some(v => typeof v !== "string")) {
      return res.status(400).json({ success: false, message: "Complete all contact form fields." });
    }
    const data = {
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
    };
    if (data.fullName.length < 2 || data.fullName.length > 100 ||
        data.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) ||
        !data.subject || data.subject.length > 160 ||
        data.message.length < 10 || data.message.length > 3000) {
      return res.status(400).json({ success: false, message: "Please enter a valid name, email, subject and message (10–3000 characters)." });
    }
    await Contact.create(data);
    // Store securely; do not claim an email or notification was sent.
    return res.status(201).json({ success: true, message: "Your message was received by InternLink." });
  } catch (error) { next(error); }
});

router.get("/", protect, authorize("admin"), async (req, res, next) => {
  try {
    const items = await Contact.find().select("fullName email subject message createdAt")
      .sort({ createdAt: -1 }).limit(100).lean();
    res.set("Cache-Control", "no-store");
    return res.json({ success: true, data: items, count: items.length });
  } catch (error) { next(error); }
});

module.exports = router;
