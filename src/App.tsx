import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/Home";
import MintPage from "./pages/Mint";
import { WalletProvider } from "./context/WalletContext";

function App() {
  return (
    <WalletProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/mint" element={<MintPage />} />
          </Routes>
        </div>
      </Router>
    </WalletProvider>
  );
}

export default App;
