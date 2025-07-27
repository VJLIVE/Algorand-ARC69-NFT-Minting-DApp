import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/Home";
import MintPage from "./pages/Mint";
import Footer from "./components/Footer";
import { WalletProvider } from "./context/WalletContext";
import { Toaster } from "react-hot-toast";
import MyNFTsPage from "./pages/MyNFTs";

function App() {
  return (
    <WalletProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-gray-900 to-blue-950 text-white">
          <Navbar />
          <main className="flex-grow pt-24 px-4">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/mint" element={<MintPage />} />
              <Route path="/mynfts" element={<MyNFTsPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster position="top-right" />
      </Router>
    </WalletProvider>
  );
}

export default App;
