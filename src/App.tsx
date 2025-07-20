import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/Home";
import MintPage from "./pages/Mint";
import { WalletProvider } from "./context/WalletContext";

function App() {
  return (
    <WalletProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-950 text-white">
          <Navbar />
          <main className="pt-24 px-4">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/mint" element={<MintPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </WalletProvider>
  );
}

export default App;
