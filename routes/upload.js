const express = require("express");
const path = require("path");
const { auth } = require("../auth/auth.js");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const { config } = require("../config/secret");

// Configure Cloudinary with API credentials
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET
});

// Route handler to upload an image to Cloudinary
router.post("/cloud", async (req, res) => {
    try {
        // Upload the image to Cloudinary with unique filename
        const dataUpload = await cloudinary.uploader.upload(req.body.image, { unique_filename: true })
        res.json({ data: dataUpload });  // Respond with the uploaded image data
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })  
    }
})

// Route handler to indicate that uploading works
router.get("/", async (req, res) => {
    res.json({ msg: "Upload work" });  // Respond with a message indicating successful upload
})



// router.post("/users", auth, async (req, res) => {
//     try {
//         const file = req.files.myFile;
//         if (!file) {
//             return res.status(400).json({ err: "You need to send file to this endpoint" })
//         }
//         if (file.size >= 1024 * 1024 * 3) {
//             return res.status(400).json({ err: "File too big: max 3 mb" });
//         }
//         console.log(file);
//         const ext_ar = [".jpg", ".jpeg", ".png"];
//         const extFile = path.extname(file.name);
//         if (!ext_ar.includes(extFile.toLowerCase())) {
//             return res.status(400).json({ err: "You can upload just image files like .jpg , .png , .jpeg" });
//         }
//         const fileUrl = "public/images/" + req.tokenData._id + "_" + Date.now() + extFile;
//         file.mv(fileUrl, (err) => {
//             if (err) { return res.status(400).json({ err }) }
//             res.json({ msg: "file uploaded", fileUrl })
//         })
//     }
//     catch (err) {
//         console.log(err);
//         res.status(502).json({ err })
//     }
// })

module.exports = router;