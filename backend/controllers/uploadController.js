const Upload = require("../models/Upload");
const { v4: uuidv4 } = require("uuid");

// -------------------- UPLOAD CONTENT --------------------
exports.uploadContent = async (req, res) => {
  try {
    const text = req.body?.text || null;
    const expiryMinutes = req.body?.expiryMinutes || 10;


    // default expiry = 10 minutes
    const expiry =
      expiryMinutes && !isNaN(expiryMinutes)
        ? Number(expiryMinutes)
        : 10;

    const expiresAt = new Date(Date.now() + expiry * 60 * 1000);

    const newUpload = new Upload({
      uuid: uuidv4(), // ✅ matches schema
      text: text || null,
      fileUrl: req.file ? `/uploads/${req.file.filename}` : null,
      expiresAt,
    });

    await newUpload.save();

    res.status(201).json({
      link: `http://localhost:5173/view/${newUpload.uuid}`,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Upload failed" });
  }
};

// -------------------- GET CONTENT --------------------
exports.getContent = async (req, res) => {
  try {
    const { id } = req.params;

    const content = await Upload.findOne({ uuid: id });

    if (!content) {
      return res.status(404).json({ message: "Link invalid" });
    }

    // check expiry
    if (new Date() > content.expiresAt) {
      return res.status(410).json({ message: "Link expired" });
    }

    res.json({
      text: content.text,
      fileUrl: content.fileUrl,
      expiresAt: content.expiresAt, // 👈 add this
    });

  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
