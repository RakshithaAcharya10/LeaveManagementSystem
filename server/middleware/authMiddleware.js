const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "Not authorized. Please login first.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id || decoded._id || decoded.userId,
      role: decoded.role,
    };

    next();

  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token.",
    });
  }
};


const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }

  return res.status(403).json({
    message: "Access denied. Admin only.",
  });
};


module.exports = {
  protect,
  adminOnly,
};