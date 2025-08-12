const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User"); // import user model
const router = express.Router();

// REGISTER
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
      userId: newUser._id, // ✅ send userId so Android can store it
      name: newUser.name
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error." });
  }
});

// LOGIN
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

    res.status(200).json({
      msg: "Login successful.",
      userId: user._id, // ✅ send userId
      name: user.name
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error." });
  }
});

// GET USER BY ID
router.get('/user/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, user });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});


module.exports = router;

