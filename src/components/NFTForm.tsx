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
    <div className="max-w-md mx-auto bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 space-y-6 border border-white/20">
      <h2 className="text-2xl font-bold text-blue-300 mb-4 text-center tracking-tight drop-shadow">Mint Your NFT</h2>
      {Object.keys(form).map((key) => (
        <div key={key} className="space-y-1">
          <label htmlFor={key} className="text-sm text-blue-200 capitalize font-semibold">
            {key === "unitName" ? "Unit Name" : key === "assetName" ? "Asset Name" : key.charAt(0).toUpperCase() + key.slice(1)}
          </label>
          <div className="relative">
            <input
              id={key}
              name={key}
              value={form[key as keyof typeof form]}
              onChange={handleChange}
              placeholder={key === "unitName" ? "e.g. ART" : key === "assetName" ? "e.g. My NFT" : key}
              className="bg-black/40 text-white placeholder-gray-400 border border-blue-400/30 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow"
            />
            {/* Icon for input */}
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 text-lg pointer-events-none">
              {key === "unitName" ? "🔤" : key === "assetName" ? "🏷️" : key === "total" ? "#" : key === "decimals" ? ".0" : ""}
            </span>
          </div>
        </div>
      ))}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`w-full px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold shadow-lg hover:from-blue-600 hover:to-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed mt-4`}
      >
        {loading ? "⏳ Minting..." : "🎨 Mint NFT"}
      </button>

      {loading && (
        <div className="mt-6">
          <ProgressBar progress={progress} color="green" />
          <p className="text-xs text-green-300 mt-2 text-center animate-pulse">Minting in progress...</p>
        </div>
      )}
    </div>
  );
};

export default NFTForm;
