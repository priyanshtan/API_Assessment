const express = require("express");
const router = express.Router();
const {
  registerUser,
  toggleUserStatus,
  getDistance,
  getUserListing
} = require("../controller/userController");
const protect = require("../middleware/middlewareAuth");

router.post("/register", registerUser);
router.put("/toggle-status", protect, toggleUserStatus);
router.get("/distance", protect, getDistance);
router.get("/list", protect, getUserListing);

module.exports = router;