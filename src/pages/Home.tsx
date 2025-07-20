import { Link } from "react-router-dom";
import algorandLogo from "/algorand.svg";
import { motion } from "framer-motion";
import { Droplet, Link as LinkIcon, Rocket, Info, Wrench, Upload } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-blue-900 px-4 pt-5 pb-10 flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-10 max-w-5xl w-full text-center border border-white/10">
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center space-y-4"
        >
          <img src={algorandLogo} alt="Algorand" className="w-16 h-16" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Algorand NFT DApp
          </h1>
          <p className="text-gray-300 text-lg max-w-xl">
            Mint your own NFTs on the Algorand blockchain. Connect your wallet, upload your art to IPFS, and mint in one click.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {[
            {
              icon: <LinkIcon size={28} />,
              title: "Connect Wallet",
              desc: "Easily connect your Algorand Testnet wallet via Pera Wallet.",
            },
            {
              icon: <Upload size={28} />,
              title: "Upload to IPFS",
              desc: "Upload your image or media file to IPFS via Pinata.",
            },
            {
              icon: <Rocket size={28} />,
              title: "Mint NFT",
              desc: "Create an ARC69 NFT directly on the Algorand blockchain.",
            },
            {
              icon: <Info size={28} />,
              title: "View Asset",
              desc: "See the Asset ID after minting. Verify it on the block explorer.",
            },
            {
              icon: <Wrench size={28} />,
              title: "Open Source",
              desc: "Fully open-source and customizable for your needs.",
            },
            {
              icon: <Droplet size={28} />,
              title: "Testnet Friendly",
              desc: "Built for Algorand Testnet, safe for experimentation.",
            },
          ].map(({ icon, title, desc }, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -6, boxShadow: "0px 12px 30px rgba(0,0,0,0.3)" }}
              transition={{ type: "spring", stiffness: 200 }}
              className="rounded-xl bg-white/10 text-white p-6 text-left space-y-3 backdrop-blur-lg border border-white/10"
            >
              <div className="text-blue-400">{icon}</div>
              <h3 className="text-lg font-bold">{title}</h3>
              <p className="text-sm text-gray-200">{desc}</p>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mt-10"
        >
          <Link
            to="/mint"
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-full font-bold shadow-md hover:shadow-xl transition hover:bg-blue-700"
          >
            Go to Mint NFT Page
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
