import React, { useState } from "react";
import axios from "axios";

const PINATA_JWT = import.meta.env.PINATA_JWT;

const PinataUpload: React.FC<{ onUpload: (ipfsHash: string) => void }> = ({ onUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first.");

    setLoading(true);

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
    } catch (err) {
      console.error(err);
      alert("Failed to upload to Pinata.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2 p-4 bg-white rounded shadow">
      <input type="file" onChange={handleChange} />
      <button
        onClick={handleUpload}
        disabled={loading || !file}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {loading ? "Uploading..." : "Upload to IPFS"}
      </button>
    </div>
  );
};

export default PinataUpload;