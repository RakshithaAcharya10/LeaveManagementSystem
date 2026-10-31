
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Import routes
const authRoutes = require("./routes/authRoutes");
const leaveRoutes = require("./routes/leaveRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://leave-management-system-three-zeta.vercel.app",
    ],
  })
);

app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/leaves", leaveRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Leave Management System API is running!",
  });
});

// Start server
const startServer = async () => {
  await connectDB();

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
