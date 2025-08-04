// server.js

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 5000;
const path=require("path");
const LOCAL_IP="192.168.31.232";

const cors = require('cors');
app.use(cors());



//mongodb atlas connection string
const mongoURI="mongodb+srv://vaishnaviyewale103:vaishnavi@cluster0.bgjkskc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

//connect to Mongodb

mongoose
.connect(mongoURI)
.then(()=> {
  console.log("✅MongoDB connected");
})
.catch((err) => {
  console.error("MongoDB connection error:",err);
});

// Middleware to parse JSON

app.use(express.json());

// Import routes
const videoUploadRoute = require("./routes/videoupload");
const authRoutes=require("./routes/auth")

// Serve the uploads folder statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Use routes
app.use("/api", videoUploadRoute);

//mount auth routes at api
app.use("/api",authRoutes);

// Image upload route
const uploadRoute = require("./routes/uploads"); //  import upload route
app.use("/api", uploadRoute); //  mount it on /api/upload



// Static folder for image access
app.use("/uploads", express.static("uploads")); //  allow access to uploaded files






//Test route(GET/)

app.get("/",(req,res)=>{
  res.send("API is working fine");
});

//mount user routes

const userRoutes=require("./routes/userRoutes");
app.use("/api",userRoutes);


// Start the server

app.listen(PORT,LOCAL_IP, () => {
  console.log(`🚀Server running at http://${LOCAL_IP}:${PORT}`);
});