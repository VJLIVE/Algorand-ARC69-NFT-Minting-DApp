import { Link, useLocation } from "react-router-dom";
import { useWallet } from "../context/WalletContext";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, LogOut, Ticket, Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const { account, connect, disconnect } = useWallet();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="backdrop-blur-md bg-black/80 shadow-xl px-6 py-4 flex items-center justify-between fixed top-0 left-0 right-0 z-50 border-b border-gray-700"
      >
        {/* Brand */}
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-blue-400 hover:opacity-90 transition"
        >
          <Ticket size={28} strokeWidth={2.5} />
          Algorand NFT DApp
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-4 items-center">
          <Link
            to="/"
            className={`text-sm font-medium ${
              location.pathname === "/" ? "text-blue-400" : "text-gray-200"
            } hover:text-blue-300 transition`}
          >
            Home
          </Link>
          {account && (
            <Link
              to="/mint"
              className={`text-sm font-medium ${
                location.pathname === "/mint" ? "text-blue-400" : "text-gray-200"
              } hover:text-blue-300 transition`}
            >
              Mint NFT
            </Link>
          )}

          {account ? (
            <>
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-mono tracking-wide">
                {account.slice(0, 6)}...{account.slice(-4)}
              </span>
              <button
                onClick={disconnect}
                className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white text-xs rounded-full hover:bg-red-700 transition"
              >
                <LogOut size={16} />
                Disconnect
              </button>
            </>
          ) : (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={connect}
              className="relative flex items-center gap-2 overflow-hidden px-6 py-2 rounded-full bg-blue-600 text-white text-sm font-semibold transition-all duration-300 hover:bg-blue-700 focus:outline-none"
            >
              <div className="z-10">
                <LogIn size={18} />
              </div>
              <span className="z-10">Connect Wallet</span>
            </motion.button>
          )}
        </div>

        {/* Hamburger (Mobile) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-blue-400"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 right-0 w-64 h-full bg-black shadow-xl z-40 pt-20 px-6 space-y-6 md:hidden"
          >
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="block text-gray-200 hover:text-blue-300 text-sm font-medium"
            >
              Home
            </Link>
            {account && (
              <Link
                to="/mint"
                onClick={() => setMenuOpen(false)}
                className="block text-gray-200 hover:text-blue-300 text-sm font-medium"
              >
                Mint NFT
              </Link>
            )}

            {account ? (
              <>
                <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-mono tracking-wide">
                  {account.slice(0, 6)}...{account.slice(-4)}
                </div>
                <button
                  onClick={() => {
                    disconnect();
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-xs rounded-full hover:bg-red-700 transition"
                >
                  <LogOut size={16} />
                  Disconnect
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  connect();
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-full hover:bg-blue-700 transition"
              >
                <LogIn size={18} />
                Connect Wallet
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
