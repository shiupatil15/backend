// routes/upload.js

const express = require("express");
const router = express.Router();
const upload = require("./../middleware/uploads");

// Use upload.array to handle multiple files
router.post("/upload", upload.array("images", 10), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ msg: "No files uploaded" });
    }

    // Map over uploaded files to create URLs
    const imageUrls = req.files.map(file => {
        return `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
    });

    res.json({
        msg: "Images uploaded successfully",
        imageUrls
    });
});

module.exports = router;