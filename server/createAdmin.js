
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = "admin@leavemanagement.com";
    const password = "Admin@12345";

    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      console.log("Admin account already exists.");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name: "System Admin",
      email,
      password: hashedPassword,
      role: "admin",
      casualLeaveBalance: 12,
      sickLeaveBalance: 10,
      earnedLeaveBalance: 15,
    });

    console.log("Admin account created successfully!");
    console.log("Email:", email);
    console.log("Password:", password);

  } catch (error) {
    console.error("Error creating admin:", error.message);
  } finally {
    await mongoose.disconnect();
  }
};

createAdmin();
