import { useWallet } from "../context/WalletContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Grid3X3, List, Eye, ExternalLink, ImageIcon, Sparkles } from "lucide-react";

const MyNFTs = () => {
    const { account } = useWallet();
    const [assets, setAssets] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [filterBy, setFilterBy] = useState<"all" | "named" | "unnamed">("all");

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

  const navigate = useNavigate();

  // Filter assets based on search and filter criteria
  const filteredAssets = assets.filter(asset => {
    const matchesSearch = !searchTerm || 
      asset.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.unitName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.metadata?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset["asset-id"].toString().includes(searchTerm);

    const matchesFilter = 
      filterBy === "all" ||
      (filterBy === "named" && (asset.title || asset.metadata?.name)) ||
      (filterBy === "unnamed" && !asset.title && !asset.metadata?.name);

    return matchesSearch && matchesFilter;
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen w-full flex flex-col items-center justify-start bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 py-8 px-4"
    >
      <div className="max-w-7xl w-full mx-auto">
        {/* Enhanced Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl shadow-lg"
              whileHover={{ rotate: 10, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <ImageIcon size={32} className="text-white" />
            </motion.div>
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent tracking-tight">
              My NFT Collection
            </h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Discover and manage your unique digital assets on the Algorand blockchain
          </p>
        </motion.div>

        {/* Search and Filter Controls */}
        {account && !loading && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8 space-y-4"
          >
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-lg">
                <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search NFTs by name, unit name, or asset ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3">
                {/* Filter Dropdown */}
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value as any)}
                  className="px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                >
                  <option value="all" className="bg-slate-800">All NFTs</option>
                  <option value="named" className="bg-slate-800">Named Only</option>
                  <option value="unnamed" className="bg-slate-800">Unnamed Only</option>
                </select>

                {/* View Mode Toggle */}
                <div className="flex bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode("grid")}
                    className={`p-3 transition-all duration-300 ${
                      viewMode === "grid"
                        ? "bg-blue-600 text-white shadow-lg"
                        : "text-gray-400 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Grid3X3 size={20} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode("list")}
                    className={`p-3 transition-all duration-300 ${
                      viewMode === "list"
                        ? "bg-blue-600 text-white shadow-lg"
                        : "text-gray-400 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <List size={20} />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Results Counter */}
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>
                Showing {filteredAssets.length} of {assets.length} NFTs
                {searchTerm && ` matching "${searchTerm}"`}
              </span>
              <span className="flex items-center gap-2">
                <Sparkles size={16} className="text-yellow-400" />
                Total Collection Value: {assets.length} NFTs
              </span>
            </div>
          </motion.div>
        )}

        {!account ? (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-32"
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
              className="p-6 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-3xl mb-6"
            >
              <ImageIcon size={64} className="text-blue-400" />
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h3>
            <p className="text-lg text-gray-300 bg-white/10 backdrop-blur-md px-8 py-4 rounded-2xl shadow-xl border border-white/20 max-w-md text-center">
              Connect your wallet to discover and manage your NFT collection on Algorand
            </p>
          </motion.div>
        ) : loading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="flex flex-col items-center justify-center py-12">
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                  scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                }}
                className="relative mb-6"
              >
                <div className="h-16 w-16 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
                <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-400" size={24} />
              </motion.div>
              <h3 className="text-xl font-semibold text-white mb-2">Loading Your NFTs</h3>
              <p className="text-gray-400">Discovering your digital treasures...</p>
            </div>
            
            {/* Skeleton Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {[...Array(8)].map((_, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-xl"
                >
                  <div className="w-full h-48 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl mb-4 animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-600 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-700 rounded w-3/4 animate-pulse"></div>
                    <div className="h-3 bg-gray-700 rounded w-1/2 animate-pulse"></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : filteredAssets.length === 0 ? (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-32"
          >
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotateZ: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="p-8 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-3xl mb-6"
            >
              <ImageIcon size={80} className="text-purple-400" />
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-4">
              {assets.length === 0 ? "No NFTs Found" : "No Matching NFTs"}
            </h3>
            <p className="text-lg text-gray-300 bg-white/10 backdrop-blur-md px-8 py-4 rounded-2xl shadow-xl border border-white/20 max-w-lg text-center">
              {assets.length === 0 
                ? "Your collection is empty. Start minting some NFTs to see them here!"
                : `No NFTs match your current search criteria. Try adjusting your filters.`
              }
            </p>
            {searchTerm && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSearchTerm("");
                  setFilterBy("all");
                }}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 shadow-lg"
              >
                Clear Filters
              </motion.button>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <AnimatePresence mode="wait">
              <motion.div 
                key={viewMode}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={viewMode === "grid" 
                  ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
                  : "space-y-4"
                }
              >
                {filteredAssets.map((asset, idx) => (
                  <motion.div
                    key={asset["asset-id"]}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: idx * 0.05,
                      type: "spring",
                      stiffness: 300,
                      damping: 20
                    }}
                    whileHover={{ 
                      y: -8, 
                      scale: 1.02,
                      transition: { type: "spring", stiffness: 400, damping: 10 }
                    }}
                    className={`group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 hover:border-blue-400/50 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer overflow-hidden ${
                      viewMode === "grid" ? "p-4" : "p-6 flex items-center gap-6"
                    }`}
                    onClick={() => navigate(`/nft/${asset["asset-id"]}`)}
                  >
                    {/* Hover glow effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-cyan-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      initial={false}
                      animate={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    />

                    {/* Image Container */}
                    <div className={`relative overflow-hidden rounded-xl ${
                      viewMode === "grid" ? "w-full h-48 mb-4" : "w-24 h-24 flex-shrink-0"
                    }`}>
                      {asset.metadata?.image ? (
                        <motion.img
                          src={
                            asset.metadata.image.startsWith("ipfs://")
                              ? `https://ipfs.io/ipfs/${asset.metadata.image.replace("ipfs://", "")}`
                              : asset.metadata.image
                          }
                          alt={asset.metadata.name || "NFT"}
                          className="w-full h-full object-cover border-2 border-blue-400/30 group-hover:border-cyan-400/50 transition-colors duration-300"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.3 }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 border-2 border-gray-600 group-hover:border-gray-500 flex items-center justify-center transition-colors duration-300">
                          <ImageIcon size={viewMode === "grid" ? 32 : 24} className="text-gray-400" />
                        </div>
                      )}
                      
                      {/* Hover overlay */}
                      <motion.div
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300"
                        initial={false}
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          whileHover={{ scale: 1 }}
                          className="p-2 bg-white/20 backdrop-blur-sm rounded-full"
                        >
                          <Eye size={20} className="text-white" />
                        </motion.div>
                      </motion.div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-2">
                      <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors duration-300 truncate" 
                          title={asset.title || asset.metadata?.name || "Unnamed NFT"}>
                        {asset.title || asset.metadata?.name || "Unnamed NFT"}
                      </h3>
                      
                      {viewMode === "grid" && (
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Unit:</span>
                            <span className="text-blue-300 font-mono">{asset.unitName || "-"}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Asset ID:</span>
                            <span className="text-cyan-300 font-mono text-xs">
                              {asset["asset-id"].toString().slice(0, 8)}...
                            </span>
                          </div>
                        </div>
                      )}

                      {viewMode === "list" && (
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400 block">Unit Name:</span>
                            <span className="text-blue-300 font-mono">{asset.unitName || "-"}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block">Asset ID:</span>
                            <span className="text-cyan-300 font-mono">{asset["asset-id"]}</span>
                          </div>
                        </div>
                      )}

                      {/* Action Button */}
                      <motion.a
                        href={`https://testnet.explorer.perawallet.app/asset/${asset["asset-id"]}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 hover:from-blue-600/40 hover:to-cyan-600/40 text-blue-300 hover:text-white text-sm rounded-lg transition-all duration-300 border border-blue-500/30 hover:border-cyan-400/50 group/btn"
                        onClick={e => e.stopPropagation()}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ExternalLink size={14} className="group-hover/btn:rotate-12 transition-transform duration-300" />
                        <span className="font-medium">Explorer</span>
                      </motion.a>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}

        {/* Collection Stats */}
        {account && !loading && assets.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-16 p-6 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-md rounded-2xl border border-white/20"
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Sparkles className="text-yellow-400" size={24} />
              Collection Statistics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-xl">
                <div className="text-3xl font-bold text-blue-300 mb-2">{assets.length}</div>
                <div className="text-gray-400">Total NFTs</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl">
                <div className="text-3xl font-bold text-purple-300 mb-2">
                  {assets.filter(a => a.title || a.metadata?.name).length}
                </div>
                <div className="text-gray-400">Named NFTs</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-emerald-600/20 to-teal-600/20 rounded-xl">
                <div className="text-3xl font-bold text-emerald-300 mb-2">
                  {assets.filter(a => a.metadata?.image).length}
                </div>
                <div className="text-gray-400">With Images</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default MyNFTs;