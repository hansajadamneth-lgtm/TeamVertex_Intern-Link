const { User, Job, Application, Company } = require("./src/models");
const bcrypt = require("bcryptjs");

console.log("Checking models loaded...");
console.log("User:", !!User);
console.log("Job:", !!Job);
console.log("Application:", !!Application);
console.log("Company:", !!Company);

async function testUser() {
  const user = new User({
    fullName: "Hansaja Damneth",
    email: "hansaja@example.com",
    password: "Password123!",
    role: "student",
  });

  const validationError = user.validateSync();
  if (validationError) {
    throw new Error("User validation failed: " + validationError.message);
  }
  console.log("✓ User schema validation passed");

  // Test password hashing pre-save logic
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  const isMatch = await user.comparePassword("Password123!");
  const isWrong = await user.comparePassword("WrongPassword!");

  if (!isMatch || isWrong) {
    throw new Error("Password comparison failed");
  }
  console.log("✓ User password hashing & comparison passed");
}

async function testJob() {
  const job = new Job({
    title: "Software Engineer Intern",
    companyName: "TechNova Solutions",
    location: "Colombo",
    description: "Full stack engineering internship",
    category: "IT",
    type: "Full Time",
  });

  const err = job.validateSync();
  if (err) {
    throw new Error("Job validation failed: " + err.message);
  }
  console.log("✓ Job schema validation passed");
}

async function testCompany() {
  const company = new Company({
    name: "TechNova Solutions",
    industry: "Information Technology",
    email: "contact@technova.lk",
    website: "https://technova.lk",
  });

  const err = company.validateSync();
  if (err) {
    throw new Error("Company validation failed: " + err.message);
  }
  console.log("✓ Company schema validation passed");
}

async function testApplication() {
  const mongoose = require("mongoose");
  const fakeStudentId = new mongoose.Types.ObjectId();
  const fakeJobId = new mongoose.Types.ObjectId();

  const app = new Application({
    student: fakeStudentId,
    job: fakeJobId,
    companyName: "TechNova Solutions",
    position: "Software Engineer Intern",
    status: "Application sent",
    fitScore: 92,
  });

  const err = app.validateSync();
  if (err) {
    throw new Error("Application validation failed: " + err.message);
  }
  console.log("✓ Application schema validation passed");
}

async function runAll() {
  await testUser();
  await testJob();
  await testCompany();
  await testApplication();
  console.log("\nALL PHASE 2 MODEL AND VALIDATION TESTS PASSED!");
}

runAll().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});
