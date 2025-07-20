import { useState } from "react";
import { useWallet } from "../context/WalletContext";
import NFTForm from "../components/NFTForm";
import PinataUpload from "../utils/PinataUpload";
import toast from "react-hot-toast";

const MintPage = () => {
  const { account } = useWallet();
  const [ipfsHash, setIpfsHash] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [mintedAssetId, setMintedAssetId] = useState<number | null>(null);

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
            onComplete={(assetId) => {
              toast.success(`🎉 NFT Created! Asset ID: ${assetId}`);
              setMintedAssetId(assetId);
              setShowModal(true);
            }}
          />
          {showModal && mintedAssetId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
              <div className="bg-gray-900 text-white rounded-xl shadow-2xl max-w-sm w-full p-6 text-center space-y-4">
                <h2 className="text-2xl font-bold text-green-400 flex items-center justify-center gap-2">
                  🎨 NFT Minted!
                </h2>
                <p className="text-gray-300">
                  Your NFT was successfully minted with Asset ID:
                </p>
                <div className="bg-gray-800 text-green-300 font-mono text-sm px-3 py-2 rounded mt-2 break-all">
                  {mintedAssetId}
                </div>
                <a
                  href={`https://testnet.explorer.perawallet.app/asset/${mintedAssetId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 mr-4 text-blue-400 underline hover:text-blue-300"
                >
                  🔗 View on AlgoExplorer
                </a>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white shadow"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MintPage;
