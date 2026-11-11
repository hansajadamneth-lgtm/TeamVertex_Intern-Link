/**
 * One-time CLI bootstrap for the first InternLink administrator.
 * Never expose this command as an HTTP route or run it automatically on Render.
 *
 * Required environment: MONGO_URI, ADMIN_EMAIL, ADMIN_DATABASE and
 * ADMIN_BOOTSTRAP_CONFIRM=CREATE_FIRST_ADMIN. Run from server/.
 */
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../src/models/User");

async function main() {
  if (process.env.ADMIN_BOOTSTRAP_CONFIRM !== "CREATE_FIRST_ADMIN" ||
      !process.env.MONGO_URI || !process.env.ADMIN_EMAIL || !process.env.ADMIN_DATABASE) {
    throw new Error("Set MONGO_URI, ADMIN_EMAIL, ADMIN_DATABASE and ADMIN_BOOTSTRAP_CONFIRM=CREATE_FIRST_ADMIN.");
  }
  const email = process.env.ADMIN_EMAIL.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("ADMIN_EMAIL is invalid.");

  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });
  if (mongoose.connection.name !== process.env.ADMIN_DATABASE) {
    throw new Error("Connected to a different database than ADMIN_DATABASE. No changes made.");
  }

  const existingAdmin = await User.exists({ role: "admin" });
  if (existingAdmin) throw new Error("An administrator already exists. Use the established admin process.");
  const user = await User.findOne({ email });
  if (!user || user.status !== "Active") {
    throw new Error("An active registered user with ADMIN_EMAIL is required. No changes made.");
  }

  user.role = "admin";
  user.sessionVersion = (user.sessionVersion || 0) + 1; // Force re-login after role change
  await user.save();
  console.log("First admin successfully provisioned. Sign in again; no credentials were printed.");
}

main()
  .catch(error => { console.error("Admin bootstrap aborted:", error.message); process.exitCode = 1; })
  .finally(async () => { await mongoose.disconnect(); });
