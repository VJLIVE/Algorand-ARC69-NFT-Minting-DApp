import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import ProgressBar from "../components/ProgressBar";

const PINATA_JWT = import.meta.env.VITE_PINATA_JWT_TOKEN;

const PinataUpload: React.FC<{ onUpload: (ipfsHash: string) => void }> = ({ onUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first.");
    setLoading(true);
    setProgress(0);
    const interval = setInterval(() => {
    setProgress((prev) => (prev < 90 ? prev + 10 : prev));
  }, 300);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        maxBodyLength: Infinity,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${PINATA_JWT}`,
        },
      });
      const ipfsHash = res.data.IpfsHash;
      onUpload(ipfsHash);
      setProgress(100);
    } catch (err) {
      console.error(err);
      alert("Failed to upload to Pinata.");
      setProgress(0);
    } finally {
      clearInterval(interval);
      setTimeout(() => {
      setLoading(false);
    }, 500);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4 p-6 bg-gray-900 rounded-2xl shadow-lg text-white"
    >
      <h2 className="text-lg font-bold">Upload File to IPFS</h2>

      <input
        type="file"
        onChange={handleChange}
        className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4
        file:rounded-full file:border-0
        file:text-sm file:font-semibold
        file:bg-blue-600 file:text-white
        hover:file:bg-blue-700"
      />

      <motion.button
        whileHover={{ scale: !loading ? 1.05 : 1 }}
        whileTap={{ scale: !loading ? 0.95 : 1 }}
        onClick={handleUpload}
        disabled={loading || !file}
        className={`w-full px-4 py-2 rounded text-white text-sm font-medium transition-all ${
          loading
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Uploading..." : "Upload to IPFS"}
      </motion.button>
      <ProgressBar progress={progress} color="blue" />
    </motion.div>
  );
};

export default PinataUpload;
