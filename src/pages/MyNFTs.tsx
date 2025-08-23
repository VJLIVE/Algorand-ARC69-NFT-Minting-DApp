import { useWallet } from "../context/WalletContext";
import { useEffect, useState } from "react";

const MyNFTs = () => {
    const { account } = useWallet();
    const [assets, setAssets] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
  const fetchNFTs = async () => {
    if (!account) return;
    setLoading(true);

    try {
      const res = await fetch(`https://testnet-api.algonode.cloud/v2/accounts/${account}`);
      const data = await res.json();
      const rawAssets = data.assets?.filter((a: any) => a["is-frozen"] === false) || [];

      const assetsWithMetadata = await Promise.all(
        rawAssets.map(async (asset: any) => {
          try {
            const assetInfoRes = await fetch(`https://testnet-api.algonode.cloud/v2/assets/${asset["asset-id"]}`);
            const assetInfoData = await assetInfoRes.json();
            let url = assetInfoData?.params?.url;
            const unitName = assetInfoData?.params?.["unit-name"] || "";
            const title = assetInfoData?.params?.name || "";

            if (!url) return { ...asset, metadata: null, unitName, title };

            // Only clean url if it is truly malformed (e.g., ends with a colon)
            if (/^.+:$/i.test(url)) url = url.slice(0, -1);

            let metadata = null;
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
            } catch (metaErr) {
              console.error("Error fetching/parsing metadata for asset:", asset["asset-id"], metaErr);
              metadata = { image: url };
            }

            return {
              ...asset,
              metadata,
              unitName,
              title,
            };
          } catch (err) {
            console.error("Error fetching metadata for asset:", asset["asset-id"], err);
            return { ...asset, metadata: null };
          }
        })
      );

      setAssets(assetsWithMetadata);
      console.log("Fetched assets with metadata:", assetsWithMetadata);
    } catch (error) {
      console.error("Error fetching assets", error);
    }

    setLoading(false);
  };

  fetchNFTs();
}, [account]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#232526] py-12 px-2">
      <div className="max-w-6xl w-full mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-blue-300 drop-shadow-lg tracking-tight">My NFTs</h1>

        {!account ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-lg text-gray-300 bg-black/30 px-6 py-4 rounded-xl shadow-lg">Please connect your wallet to view NFTs.</p>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-400 border-opacity-50 mb-4"></div>
            <p className="text-lg text-gray-300">Loading your NFTs...</p>
          </div>
        ) : assets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-lg text-gray-300 bg-black/30 px-6 py-4 rounded-xl shadow-lg">No NFTs found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {assets.map((asset, idx) => (
              <div
                key={idx}
                className="relative bg-white/10 border border-white/20 p-5 rounded-2xl shadow-xl backdrop-blur-lg transition-transform hover:scale-105 hover:shadow-2xl flex flex-col items-center"
              >
                {asset.metadata?.image ? (
                  <img
                    src={
                      asset.metadata.image.startsWith("ipfs://")
                        ? `https://ipfs.io/ipfs/${asset.metadata.image.replace("ipfs://", "")}`
                        : asset.metadata.image
                    }
                    alt={asset.metadata.name || "NFT"}
                    className="w-full h-48 object-cover rounded-xl mb-4 border-2 border-blue-400/30 shadow-md"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 rounded-xl flex items-center justify-center mb-4 border-2 border-gray-700">
                    <span className="text-xs text-gray-400">No Image</span>
                  </div>
                )}
                <div className="w-full flex flex-col items-center">
                  <p className="text-lg font-bold text-blue-200 mb-1 text-center truncate w-full" title={asset.title || asset.metadata?.name || "Unnamed NFT"}>
                    {asset.title || asset.metadata?.name || "Unnamed NFT"}
                  </p>
                  <p className="text-xs text-gray-300 mb-1">
                    <span className="font-bold text-blue-400">Unit Name:</span> {asset.unitName || "-"}
                  </p>
                  <p className="text-xs text-gray-300 mb-1">
                    <span className="font-bold text-blue-400">Title:</span> {asset.title || "-"}
                  </p>
                  <p className="font-mono text-xs text-gray-400 break-words mb-2">
                    <span className="font-bold text-blue-400">Asset ID:</span> {asset["asset-id"]}
                  </p>
                  <a
                    href={`https://testnet.explorer.perawallet.app/asset/${asset["asset-id"]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 text-xs mt-2 px-3 py-1 rounded-full bg-blue-400/10 hover:bg-blue-400/30 transition font-semibold shadow"
                  >
                    View on Explorer
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyNFTs;