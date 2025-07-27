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
      const filtered = data.assets?.filter((a: any) => a["is-frozen"] === false);
      setAssets(filtered || []);
      console.log("Fetched assets:", filtered);
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
              <p className="font-mono text-xs break-words">
                <span className="font-bold">Asset ID:</span> {asset["asset-id"]}
              </p>
              <a
                href={`https://testnet.algoexplorer.io/asset/${asset["asset-id"]}`}
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
