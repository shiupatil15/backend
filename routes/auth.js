const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User"); // import user
const router = express.Router();

// Register Route

router.post("/authregister", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ msg: "Name, Email and Password are required." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ 
      msg: "User registered successfully.",
      userId: newUser._id,
      name: newUser.name
    });
  } 
  catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error." });
  }
});

  catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error." });
  }
});

// Login Route

// Login Route
router.post("/authlogin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Email and password are required." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials." });
    }

    // ✅ Send userId in response so Android can store it
    res.status(200).json({
      msg: "Login successful.",
      userId: user._id,
      name: user.name
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error." });
  }
});

// GET /api/authuser?userId=123
router.get("/authuser", async (req, res) => {
    try {
        const { userId } = req.query; // from ?userId=123
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;
