import { useState } from "react";
import { useWallet } from "../context/WalletContext";
import NFTForm from "../components/NFTForm";
import PinataUpload from "../utils/PinataUpload";

const MintPage = () => {
  const { account } = useWallet();
  const [ipfsHash, setIpfsHash] = useState("");

  if (!account) {
    return (
      <div className="p-6 text-center text-red-400 text-lg mt-24">
        🚫 Please connect your wallet to mint NFTs.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
      <h1 className="text-3xl font-extrabold text-center text-blue-400 mb-4">
        Mint your NFT 🎨
      </h1>

      <div className="bg-black/30 backdrop-blur rounded-xl p-6 space-y-6 border border-white/10 shadow-lg">
        <div className="text-sm text-gray-300">
          <span className="font-semibold text-gray-100">Connected Account:</span>
          <div className="bg-blue-900 text-blue-200 p-2 rounded mt-1 break-all text-xs">
            {account}
          </div>
        </div>

        {/* Upload Section */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-white">1️⃣ Upload Artwork to IPFS</h2>
          <PinataUpload onUpload={setIpfsHash} />
          {ipfsHash && (
            <div className="text-sm text-green-400 mt-2">
              ✅ Uploaded:{" "}
              <a
                href={`https://ipfs.io/ipfs/${ipfsHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-green-300"
              >
                View on IPFS
              </a>
            </div>
          )}
        </div>

        {/* Mint Section */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-white">2️⃣ Mint NFT</h2>
          <NFTForm
            account={account}
            ipfsUrl={ipfsHash ? `https://ipfs.io/ipfs/${ipfsHash}` : ""}
            onComplete={(assetId) =>
              alert(`🎉 NFT Created successfully! Asset ID: ${assetId}`)
            }
          />
        </div>
      </div>
    </div>
  );
};

export default MintPage;
