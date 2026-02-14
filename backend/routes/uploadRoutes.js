const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

const {
  uploadContent,
  getContent,
} = require("../controllers/uploadController");

// ---------------- MULTER CONFIG ----------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ---------------- ROUTES ----------------
router.post("/upload", upload.single("file"), uploadContent);
router.get("/view/:id", getContent);

module.exports = router;
