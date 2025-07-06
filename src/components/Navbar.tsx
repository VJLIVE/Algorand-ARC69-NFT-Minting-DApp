import { Link, useLocation } from "react-router-dom";
import { useWallet } from "../context/WalletContext";

const Navbar = () => {
  const { account, connect, disconnect } = useWallet();
  const location = useLocation();

  return (
    <header className="bg-blue-800 text-white p-4 flex justify-between items-center">
      <Link to="/" className="font-bold text-lg">Algorand NFT DApp</Link>
      <nav className="space-x-4">
        <Link to="/" className={location.pathname === "/" ? "underline" : ""}>Home</Link>
        {account && (
          <Link to="/mint" className={location.pathname === "/mint" ? "underline" : ""}>Mint NFT</Link>
        )}
        {!account ? (
          <button onClick={connect} className="bg-green-600 px-2 py-1 rounded">
            Connect Wallet
          </button>
        ) : (
          <button onClick={disconnect} className="bg-red-600 px-2 py-1 rounded">
            Disconnect
          </button>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
