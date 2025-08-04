const express = require("express");
const router = express.Router();
const upload = require("./../middleware/uploads");

// Upload a single video file (field name should be "video")
router.post("/videoupload", upload.array("videos",5), (req, res) => {
   if (!req.files || req.files.length === 0) {
        return res.status(400).json({ msg: "No files uploaded" });
    }

    // Map over uploaded files to create URLs
    const videoUrls = req.files.map(file => {
        return `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
    });

    res.json({
        msg: "Vedios uploaded successfully",
        videoUrls
    });
});

module.exports = router;