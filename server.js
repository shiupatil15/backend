const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 5000;
const path = require("path");

const cors = require("cors");
app.use(cors());

// MongoDB Atlas connection
const mongoURI = "mongodb+srv://vaishnaviyewale103:vaishnavi@cluster0.bgjkskc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("✅ MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Middleware
app.use(express.json());

// Routes
const videoUploadRoute = require("./routes/videoupload");
const authRoutes = require("./routes/auth");
const uploadRoute = require("./routes/uploads");
const userRoutes = require("./routes/userRoutes");

app.use("/api", videoUploadRoute);
app.use("/api", authRoutes);
app.use("/api", uploadRoute);
app.use("/api", userRoutes);

// Serve uploads statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Test route
app.get("/", (req, res) => {
  res.send("API is working fine");
});

// ✅ Listen on all interfaces
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
