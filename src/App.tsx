import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { WalletProvider } from "./context/WalletContext";
import Navbar from "./components/Navbar";
import MintPage from "./pages/Mint";
import HomePage from "./pages/Home";

const App: React.FC = () => {
  return (
    <WalletProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-100">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/mint" element={<MintPage />} />
          </Routes>
        </div>
      </Router>
    </WalletProvider>
  );
};

export default App;
