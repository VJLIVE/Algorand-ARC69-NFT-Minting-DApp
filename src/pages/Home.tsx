import React from "react";
import { motion, easeOut } from "framer-motion";
import {
  RocketIcon,
  WalletIcon,
  FileUp,
  ImagePlus,
  BadgeCheck,
  Code2,
  GithubIcon,
} from "lucide-react";
import { useWallet } from "../context/WalletContext";
import { Link } from "react-router-dom";

// Variants
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: easeOut, 
    },
  },
}

const Home: React.FC = () => {
  const { account } = useWallet();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen bg-gradient-to-br from-[#0F172A] to-[#1E3A8A] text-white px-6 py-10 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold mb-4 text-center bg-gradient-to-r from-blue-300 via-purple-400 to-pink-400 text-transparent bg-clip-text"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          Algorand ARC69 NFT Minter
        </motion.h1>

        <motion.p
          className="text-base md:text-lg text-center max-w-2xl mx-auto mb-12 text-gray-300"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Mint NFTs on the Algorand TestNet — Upload media to IPFS via <strong>Pinata</strong>,
          connect securely with <strong>Pera Wallet</strong>, and enjoy a beautifully animated
          experience powered by <strong>Framer Motion</strong>.
        </motion.p>

        {/* Features */}
        <motion.div
          className="grid md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {features.map((f, i) => (
            <motion.div key={i} variants={itemVariants}>
              <FeatureCard {...f} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <Link to="/mint">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-indigo-600 hover:to-blue-700 text-white font-semibold rounded shadow inline-flex items-center gap-2 transition-all"
            >
              <RocketIcon size={18} />
              {account ? "Start Minting" : "Connect Wallet to Begin"}
            </motion.button>
          </Link>
        </motion.div>
      </div>

      {/* Optional subtle background effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 1.5 }}
      >
        <div className="absolute w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_70%)]"></div>
      </motion.div>
    </motion.div>
  );
};

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <motion.div
    whileHover={{
      y: -4,
      scale: 1.02,
      transition: { duration: 0.3, ease: "easeOut" },
    }}
    className="bg-white/10 backdrop-blur rounded-lg p-4 shadow-lg text-white border border-white/10 hover:border-blue-400/30 transition-all"
  >
    <div className="flex items-center gap-3 mb-2">
      {icon}
      <h3 className="text-lg font-bold">{title}</h3>
    </div>
    <p className="text-sm text-gray-300 leading-relaxed">{description}</p>
  </motion.div>
);

const features = [
  {
    title: "Connect Wallet",
    description:
      "Easily connect your Pera Wallet and start minting NFTs from your Algorand TestNet account.",
    icon: <WalletIcon className="text-green-400" size={28} />,
  },
  {
    title: "Upload to IPFS",
    description:
      "Securely upload your media to IPFS using Pinata JWT API. Store assets off-chain reliably.",
    icon: <ImagePlus className="text-yellow-400" size={28} />,
  },
  {
    title: "Create ARC69 NFTs",
    description:
      "Follow ARC69 metadata standards to mint NFTs with on-chain metadata for full compatibility.",
    icon: <BadgeCheck className="text-blue-400" size={28} />,
  },
  {
    title: "Asset Management",
    description:
      "Track, confirm and validate your minted assets on the Algorand blockchain with ease.",
    icon: <FileUp className="text-purple-400" size={28} />,
  },
  {
    title: "Modern Stack",
    description:
      "Built with React, TailwindCSS, Framer Motion, Lucide React, and Pera Wallet SDK.",
    icon: <Code2 className="text-pink-400" size={28} />,
  },
  {
    title: "Open Source",
    description:
      "Check the GitHub repository for full source code and contributions. Fork it, build it, own it.",
    icon: <GithubIcon className="text-gray-300" size={28} />,
  },
];

export default Home;
