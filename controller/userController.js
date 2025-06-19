const User = require("../Models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const getDistanceFromLatLonInKm = require("../utils/distCalc");

const registerUser = async (req, res) => {
  try {
    const { name, email, password, address, latitude, longitude } = req.body;
    if (!name || !email || !password || !address || !latitude || !longitude) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      latitude,
      longitude,
    });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    // console.log("Signing with:", process.env.JWT_SECRET);

    res.status(200).json({
      status_code: "200",
      message: "User registered successfully",
      data: {
        name: user.name,
        email: user.email,
        address: user.address,
        latitude: user.latitude,
        longitude: user.longitude,
        status: user.status,
        register_at: user.register_at,
        token,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const toggleUserStatus = async (req, res) => {
  try {
    await User.updateMany({}, [
      {
        $set: {
          status: {
            $cond: [{ $eq: ["$status", "active"] }, "inactive", "active"],
          },
        },
      },
    ]);
    res
      .status(200)
      .json({ status_code: "200", message: "All users status toggled" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const getDistance = async (req, res) => {
  try {
    const { destination_latitude, destination_longitude } = req.query;
    if (!destination_latitude || !destination_longitude) {
      return res
        .status(400)
        .json({ message: "Destination coordinates required" });
    }
    const user = req.user;
    const distance = getDistanceFromLatLonInKm(
      user.latitude,
      user.longitude,
      parseFloat(destination_latitude),
      parseFloat(destination_longitude)
    );
    res
      .status(200)
      .json({
        status_code: "200",
        message: "Distance fetched",
        distance: `${distance}km`,
      });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const getUserListing = async (req, res) => {
  try {
    const { week_number } = req.query;
    if (!week_number) {
      return res.status(400).json({ message: "Week number is required" });
    }

    const weekNumbers = week_number.split(",").map(Number);

    const mongoDays = weekNumbers.map(d => d + 1);

    const dayMap = {
      1: "sunday",
      2: "monday",
      3: "tuesday",
      4: "wednesday",
      5: "thursday",
      6: "friday",
      7: "saturday"
    };

    const result = {};
    for (const d of mongoDays) {
      result[dayMap[d]] = [];
    }

    const users = await User.aggregate([
      {
        $addFields: {
          weekday: { $dayOfWeek: "$register_at" } 
        }
      },
      {
        $match: {
          weekday: { $in: mongoDays }
        }
      },
      {
        $project: {
          name: 1,
          email: 1,
          weekday: 1
        }
      },
      {
        $group: {
          _id: "$weekday",
          users: { $push: { name: "$name", email: "$email" } }
        }
      }
    ]);

    for (const group of users) {
      const dayName = dayMap[group._id];
      result[dayName] = group.users;
    }

    res.status(200).json({
      status_code: "200",
      message: "Users listed by weekday",
      data: result
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerUser,
  toggleUserStatus,
  getDistance,
  getUserListing,
};
