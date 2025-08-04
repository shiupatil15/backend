const express = require("express");
const router = express.Router();
const User = require("./../models/User");

// ✅ CREATE: Register new user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, age} = req.body;
    const newUser = await User.create({ name, email, password, age });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Error creating user" });
  }
});

// ✅ get users with dynamic age filter
router.get("/users", async (req, res) => {
  try {
    const { age } = req.query;

    //Build filter object
    const filter ={};
    if (age) {
      filter.age =Number(age);//convert string to number
    }

        const users = await User.find(filter);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
});

router.put("/users/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body, // data to update
      { new: true } // return updated document
    );
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Error updating user" });
  }
});

// ✅ DELETE: Delete user by ID
router.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting user" });
  }
});

module.exports = router;