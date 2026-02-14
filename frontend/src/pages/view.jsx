import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function View() {
  const { id } = useParams();

  const [data, setData] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/view/${id}`)
      .then((res) => {
        setData(res.data);
        const expires = new Date(res.data.expiresAt).getTime();
        setTimeLeft(Math.floor((expires - Date.now()) / 1000));
      })
      .catch(() => {
        setError("Link expired or invalid");
      });
  }, [id]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const copyText = () => {
    navigator.clipboard.writeText(data.text);
    alert("Copied to clipboard!");
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-xl">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">

        <h1 className="text-2xl font-bold mb-4 text-center">
          📦 Shared Content
        </h1>

        <p className="text-center text-gray-600 mb-4">
          ⏳ Expires in{" "}
          <span className="font-semibold text-red-600">
            {Math.max(timeLeft, 0)} seconds
          </span>
        </p>

        {/* TEXT CONTENT */}
        {data.text && (
          <>
            <textarea
              readOnly
              value={data.text}
              className="w-full border p-3 rounded mb-2 bg-gray-50"
            />

            <button
              onClick={copyText}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 mb-4"
            >
              📋 Copy to Clipboard
            </button>
          </>
        )}

        {/* FILE DOWNLOAD (DO NOT TOUCH LOGIC) */}
        {data.fileUrl && (
          <a
            href={`http://localhost:5000${data.fileUrl}`}
            download
            className="block text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            ⬇ Download File
          </a>
        )}
      </div>
    </div>
  );
}
