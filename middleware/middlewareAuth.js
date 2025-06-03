const jwt = require("jsonwebtoken");
const User = require("../Models/User");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided or bad format" });
    }

    const token = authHeader.split(" ")[1];

    // ✅ Debug log — shows the token and secret being used
    console.log("Verifying token:", token);
    console.log("Using secret:", process.env.JWT_SECRET);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (err) {
    console.error("JWT Error:", err.message); // Only print message, not full stack
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = protect;
