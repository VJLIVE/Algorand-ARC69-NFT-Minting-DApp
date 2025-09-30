import { useState } from "react";
import { useWallet } from "../context/WalletContext";
import NFTForm from "../components/NFTForm";
import PinataUpload from "../utils/PinataUpload";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Upload, Sparkles, CheckCircle, ExternalLink, X, Wallet, ArrowRight } from "lucide-react";

const MintPage = () => {
  const { account } = useWallet();
  const [ipfsHash, setIpfsHash] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [mintedAssetId, setMintedAssetId] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  if (!account) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 px-4"
      >
        <motion.div
          className="text-center space-y-6 max-w-md"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            animate={{ 
              rotateY: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotateY: { duration: 4, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
            className="p-8 bg-gradient-to-br from-red-600/20 to-pink-600/20 rounded-3xl mb-6 inline-block"
          >
            <Wallet size={64} className="text-red-400" />
          </motion.div>
          <h2 className="text-3xl font-bold text-white mb-4">Wallet Required</h2>
          <p className="text-lg text-gray-300 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20">
            Please connect your wallet to start minting amazing NFTs on Algorand
          </p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 py-8 px-4"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center space-y-6"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <motion.div
              className="p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl shadow-2xl"
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Palette size={40} className="text-white" />
            </motion.div>
            <div>
              <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent tracking-tight">
                Create Your NFT
              </h1>
              <p className="text-gray-400 text-lg mt-2">
                Transform your digital art into a unique blockchain asset
              </p>
            </div>
          </div>

          {/* Progress Indicator */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                {[1, 2].map((step) => (
                  <div key={step} className="flex items-center">
                    <motion.div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                        currentStep >= step
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                          : "bg-gray-600 text-gray-400"
                      }`}
                      whileHover={{ scale: 1.1 }}
                    >
                      {currentStep > step ? (
                        <CheckCircle size={20} />
                      ) : (
                        step
                      )}
                    </motion.div>
                    {step < 2 && (
                      <motion.div 
                        className={`w-16 h-1 mx-2 rounded transition-all duration-500 ${
                          currentStep > step ? "bg-gradient-to-r from-purple-600 to-pink-600" : "bg-gray-600"
                        }`}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: currentStep > step ? 1 : 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-400">
                Step {currentStep} of 2
              </div>
            </div>
            <div className="text-center">
              <span className="text-white font-semibold">
                {currentStep === 1 ? "Upload Your Artwork" : "Mint Your NFT"}
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Wallet Info Card */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              className="p-2 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-xl"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Wallet size={24} className="text-white" />
            </motion.div>
            <div>
              <span className="font-semibold text-white text-lg">Connected Wallet</span>
              <p className="text-gray-400 text-sm">Ready to mint on Algorand Testnet</p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-emerald-900/50 to-cyan-900/50 text-emerald-200 p-4 rounded-xl border border-emerald-500/30">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm break-all">{account}</span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigator.clipboard.writeText(account)}
                className="ml-3 p-2 hover:bg-white/10 rounded-lg transition-colors"
                title="Copy address"
              >
                📋
              </motion.button>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">

          {/* Upload Section */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-xl space-y-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                className="p-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl"
                whileHover={{ scale: 1.1, rotate: -5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Upload size={28} className="text-white" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-white">Step 1: Upload Artwork</h2>
                <p className="text-gray-400">Upload your digital art to IPFS storage</p>
              </div>
            </div>
            
            <PinataUpload 
              onUpload={(hash) => {
                setIpfsHash(hash);
                setCurrentStep(2);
              }}
            />
            
            <AnimatePresence>
              {ipfsHash && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 border border-green-500/30 rounded-xl p-4"
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
                    >
                      <CheckCircle className="text-green-400" size={24} />
                    </motion.div>
                    <div>
                      <p className="text-green-300 font-semibold">Upload Successful!</p>
                      <a
                        href={`https://ipfs.io/ipfs/${ipfsHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors text-sm mt-1"
                      >
                        <ExternalLink size={14} />
                        View on IPFS
                      </a>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Mint Section */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className={`bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-xl space-y-6 transition-all duration-500 ${
              !ipfsHash ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Sparkles size={28} className="text-white" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  Step 2: Mint NFT
                  {ipfsHash && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <ArrowRight className="text-green-400" size={24} />
                    </motion.div>
                  )}
                </h2>
                <p className="text-gray-400">
                  {ipfsHash ? "Create your NFT on Algorand blockchain" : "Upload artwork first to proceed"}
                </p>
              </div>
            </div>
            
            <NFTForm
              account={account}
              ipfsUrl={ipfsHash ? `https://ipfs.io/ipfs/${ipfsHash}` : ""}
              onComplete={(assetId) => {
                toast.success(`🎉 NFT Created! Asset ID: ${assetId}`);
                setMintedAssetId(assetId);
                setShowModal(true);
              }}
            />
          </motion.div>
        </div>
        {/* Enhanced Success Modal */}
        <AnimatePresence>
          {showModal && mintedAssetId && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4"
              onClick={() => setShowModal(false)}
            >
              <motion.div 
                initial={{ scale: 0.5, opacity: 0, y: 100 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.5, opacity: 0, y: 100 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-gradient-to-br from-gray-900 via-blue-900/50 to-gray-900 text-white rounded-3xl shadow-2xl max-w-lg w-full p-8 text-center space-y-6 border border-white/20"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Success Animation */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
                  className="flex items-center justify-center mb-6"
                >
                  <motion.div
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{
                      rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                      scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className="p-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full shadow-2xl"
                  >
                    <Palette size={48} className="text-white" />
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-4">
                    � NFT Successfully Minted!
                  </h2>
                  <p className="text-gray-300 text-lg mb-6">
                    Your unique digital asset is now live on the Algorand blockchain
                  </p>
                </motion.div>

                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 border border-green-500/30 rounded-2xl p-6 space-y-4"
                >
                  <p className="text-green-300 font-semibold">Asset ID:</p>
                  <div className="bg-black/50 text-green-200 font-mono text-lg px-4 py-3 rounded-xl border border-green-500/20 break-all">
                    {mintedAssetId}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="flex flex-col sm:flex-row gap-4 pt-4"
                >
                  <motion.a
                    href={`https://testnet.explorer.perawallet.app/asset/${mintedAssetId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ExternalLink size={20} />
                    View on Explorer
                  </motion.a>
                  <motion.button
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 rounded-xl font-semibold transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X size={20} />
                    Close
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default MintPage;
