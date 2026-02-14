const mongoose = require("mongoose");

const uploadSchema = new mongoose.Schema({
  uuid: {
    type: String,
    required: true,
    unique: true,
  },
  text: {
    type: String,
    default: null,
  },
  fileUrl: {
    type: String,
    default: null,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("Upload", uploadSchema);
