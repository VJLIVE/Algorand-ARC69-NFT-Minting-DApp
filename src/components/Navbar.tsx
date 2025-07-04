import React from "react";
import { LogOut, Wallet } from "lucide-react";
import { useWallet } from "../context/WalletContext";
import { motion } from "framer-motion";

const Navbar: React.FC = () => {
  const { account, connect, disconnect } = useWallet();

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full px-6 py-4 flex justify-between items-center"
      style={{
        background: "linear-gradient(90deg, #0F172A, #1E3A8A)",
        color: "#fff",
        minHeight: "80px",
      }}
    >
      <h1 className="text-2xl font-bold tracking-wide">
        🚀 Algorand NFT Minter
      </h1>

      {account ? (
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <span className="text-sm">
            Connected:{" "}
            <b>
              {account.slice(0, 6)}...{account.slice(-4)}
            </b>
          </span>
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "#dc2626" }}
            whileTap={{ scale: 0.95 }}
            onClick={disconnect}
            className="flex items-center gap-1 px-4 py-2 bg-red-500 text-white rounded shadow"
          >
            <LogOut size={16} />
            <span>Disconnect</span>
          </motion.button>
        </motion.div>
      ) : (
        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: "#16a34a" }}
          whileTap={{ scale: 0.95 }}
          onClick={connect}
          className="flex items-center gap-1 px-4 py-2 bg-green-500 text-white rounded shadow"
        >
          <Wallet size={16} />
          <span>Connect Wallet</span>
        </motion.button>
      )}
    </motion.header>
  );
};

export default Navbar;
