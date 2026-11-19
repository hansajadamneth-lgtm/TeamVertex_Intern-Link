const crypto = require("node:crypto");
const User = require("../models/User");

const GENERIC_RESPONSE = "If an active account exists and email delivery is available, password reset instructions will be sent.";
const RESET_LIFETIME_MS = 15 * 60 * 1000;

function resetConfig() {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.PASSWORD_RESET_FROM;
  const configuredOrigin = process.env.PASSWORD_RESET_BASE_URL ||
    process.env.CLIENT_URL?.split(",")[0]?.trim();

  if (!key || !from || !configuredOrigin) return null;
  try {
    const url = new URL(configuredOrigin);
    const production = process.env.NODE_ENV === "production";
    if (production ? url.protocol !== "https:" :
        !["http:", "https:"].includes(url.protocol)) return null;
    if (url.username || url.password || url.search || url.hash ||
        url.pathname !== "/") return null;
    return { key, from, origin: url.origin };
  } catch { return null; }
}

const digest = (token) => crypto.createHash("sha256").update(token).digest("hex");

async function requestPasswordReset(req, res, next) {
  try {
    res.set("Cache-Control", "no-store");
    const email = req.body?.email;
    if (typeof email !== "string" || email.length > 254 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ success: false, message: "Provide a valid email address." });
    }

    const config = resetConfig();
    if (!config) {
      return res.status(503).json({
        success: false,
        message: "Password recovery email is not configured. Sign in to change your password in Settings, or contact the administrator.",
      });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase(), status: "Active" });
    if (!user) return res.json({ success: true, message: GENERIC_RESPONSE });

    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = digest(token);
    user.resetPasswordToken = tokenHash;
    user.resetPasswordExpire = new Date(Date.now() + RESET_LIFETIME_MS);
    await user.save();

    const link = new URL("/reset-password", config.origin);
    link.searchParams.set("token", token);

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: config.from,
          to: [user.email],
          subject: "InternLink — Reset your password",
          text: `A password reset was requested for your InternLink account. Use this single-use link within 15 minutes:\n\n${link.toString()}\n\nIf you did not request this, ignore this message.`,
        }),
        signal: AbortSignal.timeout(10000),
      });
      if (!response.ok) throw new Error("Email delivery service rejected the request.");
    } catch (deliveryError) {
      // A failed delivery must never leave a valid but inaccessible reset link.
      await User.updateOne(
        { _id: user._id, resetPasswordToken: tokenHash },
        { $set: { resetPasswordToken: null, resetPasswordExpire: null } }
      );
      console.error("Password reset email delivery failed.");
      // Do not reveal account existence through different email-delivery errors.
      return res.json({ success: true, message: GENERIC_RESPONSE });
    }

    return res.json({ success: true, message: GENERIC_RESPONSE });
  } catch (error) { next(error); }
}

async function resetPassword(req, res, next) {
  try {
    res.set("Cache-Control", "no-store");
    const { token, newPassword } = req.body || {};
    if (typeof token !== "string" || !/^[a-f0-9]{64}$/i.test(token) ||
        typeof newPassword !== "string" || newPassword.length < 10 ||
        newPassword.length > 128) {
      return res.status(400).json({
        success: false,
        message: "Provide a valid reset link and a new password between 10 and 128 characters.",
      });
    }

    // Claim the token atomically so it cannot be reused by concurrent requests.
    const user = await User.findOneAndUpdate(
      { resetPasswordToken: digest(token), resetPasswordExpire: { $gt: new Date() }, status: "Active" },
      { $set: { resetPasswordToken: null, resetPasswordExpire: null } },
      { new: true }
    );
    if (!user) {
      return res.status(400).json({ success: false, message: "This reset link is invalid or has expired." });
    }

    user.password = newPassword; // User pre-save middleware hashes the password.
    user.sessionVersion = (user.sessionVersion ?? 0) + 1;
    await user.save();

    res.clearCookie("token", {
      httpOnly: true, secure: process.env.NODE_ENV === "production",
      sameSite: "lax", path: "/",
    });
    return res.json({ success: true, message: "Password updated. All old sessions have been invalidated. Please sign in." });
  } catch (error) { next(error); }
}

module.exports = { requestPasswordReset, resetPassword };
