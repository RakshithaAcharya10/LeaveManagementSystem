
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["employee", "admin"],
      default: "employee",
    },

    casualLeaveBalance: {
      type: Number,
      default: 12,
    },

    sickLeaveBalance: {
      type: Number,
      default: 10,
    },

    earnedLeaveBalance: {
      type: Number,
      default: 15,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
