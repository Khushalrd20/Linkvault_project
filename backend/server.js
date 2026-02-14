const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("./utils/cleanup");

const app = express();
const PORT = 5000;

// -------------------- MIDDLEWARE --------------------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// -------------------- ROUTES --------------------
const uploadRoutes = require("./routes/uploadRoutes");
app.use("/api", uploadRoutes);

// -------------------- MONGODB CONNECTION --------------------
mongoose
  .connect("mongodb://127.0.0.1:27017/linkvault")
  .then(() => {
    console.log(" MongoDB connected");
  })
  .catch((err) => {
    console.error(" MongoDB connection error:", err);
  });

// -------------------- START SERVER --------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
