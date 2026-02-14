import { useState } from "react";
import axios from "axios";

export default function Upload() {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [expiryMinutes, setExpiryMinutes] = useState(10);
  const [link, setLink] = useState("");
  const [error, setError] = useState("");

  const handleUpload = async () => {
    setError("");
    setLink("");

    const formData = new FormData();
    formData.append("text", text);
    formData.append("expiryMinutes", expiryMinutes);
    if (file) formData.append("file", file);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setLink(res.data.link);
    } catch (err) {
      setError("Upload failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center pt-16">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-md px-8 py-6">

        {/* Header */}
        <h1 className="text-3xl font-bold text-center mb-6">
          🔐 LinkVault
        </h1>

        {/* Text Input */}
        <label className="block font-medium mb-1">
          Text to share (optional)
        </label>
        <textarea
          placeholder="Enter text to share"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full border rounded-md p-3 mb-4 resize-none"
          rows={4}
        />

        {/* File Input */}
        <label className="block font-medium mb-1">
          File (optional)
        </label>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-4"
        />

        {/* Expiry */}
        <label className="block font-medium mb-1">
          Expiry (minutes)
        </label>
        <input
          type="number"
          value={expiryMinutes}
          onChange={(e) => setExpiryMinutes(e.target.value)}
          className="w-full border rounded-md p-2 mb-6"
        />

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Upload
        </button>

        {/* Link Output */}
        {link && (
          <div className="mt-6 p-4 bg-gray-50 border rounded-md">
            <p className="font-medium mb-1">Share this link:</p>
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 break-all underline"
            >
              {link}
            </a>
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="text-red-600 mt-4 text-center">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
