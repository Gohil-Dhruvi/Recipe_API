const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

exports.verifyToken = async (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // Verify the JWT using the hardcoded secret key "usertoken"
    const decoded = jwt.verify(token, "usertoken");  // Use hardcoded secret key
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // Attach user to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("JWT Verify Error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }
    next();
  };
};
