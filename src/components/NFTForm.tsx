import React, { useState } from "react";
import { createAsset } from "../utils/algorand";
import toast from "react-hot-toast";
import ProgressBar from "./ProgressBar";

type NFTFormProps = {
  onComplete: (assetId: number) => void;
  account: string;
  ipfsUrl: string;
};

const NFTForm: React.FC<NFTFormProps> = ({ onComplete, account, ipfsUrl }) => {
  const [form, setForm] = useState({
    unitName: "",
    assetName: "",
    total: 1,
    decimals: 0,
  });

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value =
      e.target.type === "number" ? Number(e.target.value) : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = async () => {
    if (!ipfsUrl) {
      toast.error("⚠️ Please upload an image first.");
      return;
    }

    setLoading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => (prev < 90 ? prev + 5 : prev));
    }, 300);

    const assetId = await createAsset({ ...form, url: ipfsUrl }, account).catch((err) => {
      toast.error(err.message || "❌ Failed to mint NFT");
      setLoading(false);
      clearInterval(interval);
    });

    if (assetId) {
      clearInterval(interval);
      setProgress(100);

      setTimeout(() => {
        onComplete(assetId);
        setLoading(false);
        setProgress(0);
      }, 500);
    }
  };

  return (
    <div className="space-y-4">
      {Object.keys(form).map((key) => (
        <div key={key} className="space-y-1">
          <label htmlFor={key} className="text-sm text-gray-300 capitalize">
            {key}
          </label>
          <input
            id={key}
            name={key}
            value={form[key as keyof typeof form]}
            onChange={handleChange}
            placeholder={key}
            className="bg-black/50 text-white placeholder-gray-400 border border-gray-600 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      ))}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`w-full px-4 py-2 rounded bg-blue-600 text-white font-semibold shadow hover:bg-blue-500 transition disabled:opacity-50`}
      >
        {loading ? "⏳ Minting..." : "🎨 Create NFT"}
      </button>

      {loading && <ProgressBar progress={progress} color="green" />}
    </div>
  );
};

export default NFTForm;
