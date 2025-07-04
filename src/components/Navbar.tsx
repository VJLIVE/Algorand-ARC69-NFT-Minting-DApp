import React, { useState } from "react";
import { LogOut, Wallet, Menu, X } from "lucide-react";
import { useWallet } from "../context/WalletContext";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Navbar: React.FC = () => {
  const { account, connect, disconnect } = useWallet();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Mint", path: "/mint" },
  ];

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full px-6 py-4 flex justify-between items-center relative z-20"
      style={{
        background: "linear-gradient(90deg, #0F172A, #1E3A8A)",
        color: "#fff",
        minHeight: "80px",
      }}
    >
      <Link to="/" className="text-2xl font-bold tracking-wide">
        Algorand NFT Minter
      </Link>
      <nav className="hidden md:flex gap-6 items-center">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`hover:text-blue-300 ${location.pathname === link.path ? "text-blue-300" : ""
              }`}
          >
            {link.name}
          </Link>
        ))}
        {account ? (
          <div className="flex items-center gap-4">
            <span className="text-sm hidden md:inline">
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
          </div>
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
      </nav>
      <div className="md:hidden">
        <button onClick={toggleMenu} className="focus:outline-none">
          <Menu size={28} />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-black z-40"
            />
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3 }}
              className="
          fixed top-0 right-0 
          bg-[#0F172A] 
          w-3/4 h-full 
          flex flex-col gap-6 px-6 py-8 
          shadow-lg z-50
        "
            >
              <button
                onClick={() => setMenuOpen(false)}
                className="self-end text-white mb-4"
              >
                <X size={28} />
              </button>
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className={`text-lg ${location.pathname === link.path ? "text-blue-300" : ""}`}
                >
                  {link.name}
                </Link>
              ))}

              <div className="mt-auto">
                {account ? (
                  <div className="flex flex-col gap-4">
                    <span className="text-sm">
                      Connected: <b>{account.slice(0, 6)}...{account.slice(-4)}</b>
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.05, backgroundColor: "#dc2626" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        disconnect();
                        setMenuOpen(false);
                      }}
                      className="flex items-center gap-1 px-4 py-2 bg-red-500 text-white rounded shadow"
                    >
                      <LogOut size={16} />
                      <span>Disconnect</span>
                    </motion.button>
                  </div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: "#16a34a" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      connect();
                      setMenuOpen(false);
                    }}
                    className="flex items-center gap-1 px-4 py-2 bg-green-500 text-white rounded shadow"
                  >
                    <Wallet size={16} />
                    <span>Connect Wallet</span>
                  </motion.button>
                )}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;