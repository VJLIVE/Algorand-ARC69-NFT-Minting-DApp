import React, { useState } from "react";
import { createAsset } from "../utils/algorand";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value =
      e.target.type === "number" ? Number(e.target.value) : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = async () => {
    if (!ipfsUrl) return alert("Please upload an image first.");

    setLoading(true);
    const assetId = await createAsset({ ...form, url: ipfsUrl }, account).catch((err) => {
      alert(err.message);
      setLoading(false);
    });
    if (assetId) {
      onComplete(assetId);
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded space-y-2">
      {Object.keys(form).map((key) => (
        <input
          key={key}
          name={key}
          value={form[key as keyof typeof form]}
          onChange={handleChange}
          placeholder={key}
          className="border p-2 rounded w-full"
        />
      ))}
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Creating..." : "Create NFT"}
      </button>
    </div>
  );
};

export default NFTForm;