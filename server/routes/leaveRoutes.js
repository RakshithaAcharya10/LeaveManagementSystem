const express = require("express");
const router = express.Router();

const {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus,
} = require("../controllers/leaveController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/", protect, applyLeave);
router.get("/my-leaves", protect, getMyLeaves);
router.get("/", protect, adminOnly, getAllLeaves);
router.patch("/:id/status", protect, adminOnly, updateLeaveStatus);

module.exports = router;