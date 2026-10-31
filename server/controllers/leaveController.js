
const Leave = require("../models/Leave");
const User = require("../models/User");

const getUserId = (req) =>
  req.user?.id || req.user?._id || req.user?.userId;

const calculateDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  start.setUTCHours(0, 0, 0, 0);
  end.setUTCHours(0, 0, 0, 0);

  return Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;
};

const balanceFields = {
  Casual: "casualLeaveBalance",
  Sick: "sickLeaveBalance",
  Earned: "earnedLeaveBalance",
};

exports.applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body || {};

    if (
      !leaveType ||
      !startDate ||
      !endDate ||
      typeof reason !== "string" ||
      !reason.trim()
    ) {
      return res.status(400).json({
        message: "Please provide all leave details.",
      });
    }

    const balanceField = balanceFields[leaveType];

    if (!balanceField) {
      return res.status(400).json({
        message: "Invalid leave type.",
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime()) ||
      end < start
    ) {
      return res.status(400).json({
        message: "Please provide valid leave dates.",
      });
    }

    const numberOfDays = calculateDays(start, end);

    const user = await User.findById(getUserId(req));

    if (!user || user.role !== "employee") {
      return res.status(404).json({
        message: "Employee not found.",
      });
    }

    if (user[balanceField] < numberOfDays) {
      return res.status(400).json({
        message: `Insufficient ${leaveType} leave balance.`,
      });
    }

    // Check overlapping pending or approved leaves
    const existingLeave = await Leave.findOne({
      employee: user._id,
      status: { $in: ["Pending", "Approved"] },
      startDate: { $lte: end },
      endDate: { $gte: start },
    });

    if (existingLeave) {
      return res.status(400).json({
        message:
          "You already have a pending or approved leave during these dates.",
      });
    }

    const leave = await Leave.create({
      employee: user._id,
      employeeName: user.name,
      employeeEmail: user.email,
      leaveType,
      startDate: start,
      endDate: end,
      numberOfDays,
      reason: reason.trim(),
    });

    return res.status(201).json({
      message: "Leave application submitted successfully.",
      leave,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.getMyLeaves = async (req, res) => {
  try {
    const employeeId = getUserId(req);

    const user = await User.findById(employeeId).select(
      "name email role casualLeaveBalance sickLeaveBalance earnedLeaveBalance"
    );

    if (!user || user.role !== "employee") {
      return res.status(404).json({
        message: "Employee not found.",
      });
    }

    const leaves = await Leave.find({
      employee: employeeId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      count: leaves.length,
      leaves,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate("employee", "name email")
      .populate("reviewedBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: leaves.length,
      leaves,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.updateLeaveStatus = async (req, res) => {
  try {
    const { status, adminRemarks = "" } = req.body || {};

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({
        message: "Status must be Approved or Rejected.",
      });
    }

    const leave = await Leave.findOne({
      _id: req.params.id,
      status: "Pending",
    });

    if (!leave) {
      return res.status(404).json({
        message: "Pending leave request not found.",
      });
    }

    if (status === "Approved") {
      const balanceField = balanceFields[leave.leaveType];

      const updatedUser = await User.findOneAndUpdate(
        {
          _id: leave.employee,
          [balanceField]: { $gte: leave.numberOfDays },
        },
        {
          $inc: {
            [balanceField]: -leave.numberOfDays,
          },
        },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(400).json({
          message: "Employee has insufficient leave balance.",
        });
      }
    }

    const updatedLeave = await Leave.findOneAndUpdate(
      {
        _id: leave._id,
        status: "Pending",
      },
      {
        $set: {
          status,
          adminRemarks,
          reviewedBy: getUserId(req),
        },
      },
      { new: true }
    );

    if (!updatedLeave) {
      if (status === "Approved") {
        await User.findByIdAndUpdate(leave.employee, {
          $inc: {
            [balanceFields[leave.leaveType]]: leave.numberOfDays,
          },
        });
      }

      return res.status(409).json({
        message: "This leave request has already been processed.",
      });
    }

    return res.status(200).json({
      message: `Leave ${status.toLowerCase()} successfully.`,
      leave: updatedLeave,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
