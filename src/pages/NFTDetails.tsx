import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const NFTDetails = () => {
  const { id } = useParams();
  const [asset, setAsset] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAsset = async () => {
      setLoading(true);
      try {
        const assetInfoRes = await fetch(`https://testnet-api.algonode.cloud/v2/assets/${id}`);
        const assetInfoData = await assetInfoRes.json();
        let url = assetInfoData?.params?.url;
        const unitName = assetInfoData?.params?.["unit-name"] || "";
        const title = assetInfoData?.params?.name || "";
        let metadata = null;
        if (url) {
          if (/^.+:$/i.test(url)) url = url.slice(0, -1);
          try {
            if (url.startsWith("ipfs://")) {
              const ipfsHash = url.replace("ipfs://", "");
              const metadataRes = await fetch(`https://ipfs.io/ipfs/${ipfsHash}`);
              const contentType = metadataRes.headers.get("content-type");
              if (contentType && contentType.includes("application/json")) {
                metadata = await metadataRes.json();
              } else {
                metadata = { image: `https://ipfs.io/ipfs/${ipfsHash}` };
              }
            } else if (url.startsWith("https://") || url.startsWith("http://")) {
              const metadataRes = await fetch(url);
              const contentType = metadataRes.headers.get("content-type");
              if (contentType && contentType.includes("application/json")) {
                metadata = await metadataRes.json();
              } else {
                metadata = { image: url };
              }
            } else {
              metadata = { image: url };
            }
          } catch {
            metadata = { image: url };
          }
        }
        setAsset({ ...assetInfoData, unitName, title, metadata });
      } catch (err) {
        setAsset(null);
      }
      setLoading(false);
    };
    fetchAsset();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#232526]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-400 border-opacity-50"></div>
      </div>
    );
  }
  if (!asset) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#232526]">
        <p className="text-lg text-gray-300 bg-black/30 px-6 py-4 rounded-xl shadow-lg">NFT not found.</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#232526] py-12 px-2">
      <div className="max-w-xl w-full mx-auto bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 backdrop-blur-lg">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-blue-300 drop-shadow-lg tracking-tight">NFT Details</h1>
        <div className="flex flex-col items-center">
          {asset.metadata?.image ? (
            <div className="flex items-center justify-center w-full mb-6">
              <img
                src={
                  asset.metadata.image.startsWith("ipfs://")
                    ? `https://ipfs.io/ipfs/${asset.metadata.image.replace("ipfs://", "")}`
                    : asset.metadata.image
                }
                alt={asset.metadata.name || asset.title || "NFT"}
                className="max-w-md w-full h-auto max-h-80 object-contain rounded-xl border-4 border-blue-400/40 shadow-lg bg-black/30"
                style={{ background: "linear-gradient(135deg, #232526 0%, #2c5364 100%)" }}
              />
            </div>
          ) : (
            <div className="w-full h-64 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 rounded-xl flex items-center justify-center mb-6 border-2 border-gray-700">
              <span className="text-xs text-gray-400">No Image</span>
            </div>
          )}
          <p className="text-2xl font-bold text-blue-200 text-center mb-2" title={asset.title || asset.metadata?.name || "Unnamed NFT"}>
            {asset.title || asset.metadata?.name || "Unnamed NFT"}
          </p>
          <p className="text-base text-gray-300 mb-1">
            <span className="font-bold text-blue-400">Unit Name:</span> {asset.unitName || "-"}
          </p>
          <p className="text-base text-gray-300 mb-1">
            <span className="font-bold text-blue-400">Title:</span> {asset.title || "-"}
          </p>
          <p className="font-mono text-base text-blue-400 break-words mb-2">
            <span className="font-bold">Asset ID:</span> {asset["index"] || asset["asset-index"] || "-"}
          </p>
          <a
            href={`https://testnet.explorer.perawallet.app/asset/${asset["index"] || asset["asset-index"]}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 text-xs mt-2 px-3 py-1 rounded-full bg-blue-400/10 hover:bg-blue-400/30 transition font-semibold shadow inline-block"
          >
            View on Explorer
          </a>
        </div>
      </div>
    </div>
  );
};

export default NFTDetails;
