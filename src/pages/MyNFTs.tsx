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

                if (!url) return { ...asset, metadata: null };

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
                      // Try to parse as text if not JSON
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
                    // Fallback: treat as direct image URL
                    metadata = { image: url };
                  }
                } catch (metaErr) {
                  console.error("Error fetching/parsing metadata for asset:", asset["asset-id"], metaErr);
                  metadata = { image: url };
                }

                return {
                  ...asset,
                  metadata,
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
        <div className="max-w-5xl mx-auto py-8 text-white">
            <h1 className="text-3xl font-bold mb-6">My NFTs</h1>

            {!account ? (
                <p>Please connect your wallet to view NFTs.</p>
            ) : loading ? (
                <p>Loading your NFTs...</p>
            ) : assets.length === 0 ? (
                <p>No NFTs found.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {assets.map((asset, idx) => (
                        <div
                            key={idx}
                            className="bg-white/10 border border-white/20 p-4 rounded-xl backdrop-blur"
                        >
                            {asset.metadata?.image ? (
                                <img
                                    src={
                                        asset.metadata.image.startsWith("ipfs://")
                                            ? `https://ipfs.io/ipfs/${asset.metadata.image.replace("ipfs://", "")}`
                                            : asset.metadata.image
                                    }
                                    alt={asset.metadata.name || "NFT"}
                                    className="w-full h-48 object-cover rounded-lg mb-3"
                                />
                            ) : (
                                <div className="w-full h-48 bg-gray-800 rounded-lg flex items-center justify-center mb-3">
                                    <span className="text-xs text-gray-400">No Image</span>
                                </div>
                            )}
                            <p className="text-sm font-semibold mb-1">
                                {asset.metadata?.name || "Unnamed NFT"}
                            </p>
                            <p className="font-mono text-xs break-words">
                                <span className="font-bold">Asset ID:</span> {asset["asset-id"]}
                            </p>
                            <a
                                href={`https://testnet.explorer.perawallet.app/asset/${asset["asset-id"]}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 text-sm mt-2 block"
                            >
                                View on Explorer
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyNFTs;