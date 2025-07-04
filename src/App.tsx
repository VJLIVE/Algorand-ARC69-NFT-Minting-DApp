import React, { useState } from "react";
import "./App.css";
import { WalletProvider, useWallet } from "./context/WalletContext";
import Navbar from "./components/Navbar";
import NFTForm from "./components/NFTForm";
import PinataUpload from "./utils/PinataUpload";

const Content: React.FC = () => {
  const { account } = useWallet();
  const [ipfsHash, setIpfsHash] = useState<string>("");

  return (
    <main className="flex flex-col items-center justify-center p-4 space-y-6">
      {!account ? (
        <div className="text-lg text-gray-600">
          Please connect your wallet above to mint an NFT.
        </div>
      ) : (
        <div className="w-full max-w-md space-y-4">
          <div className="text-center">
            Connected Account: <b>{account}</b>
          </div>

          {/* Upload file to Pinata and get IPFS hash */}
          <PinataUpload onUpload={(hash) => setIpfsHash(hash)} />

          {/* Create NFT with the uploaded IPFS URL */}
          <NFTForm
            account={account}
            onComplete={(assetId) =>
              alert(`✅ NFT Created successfully! Asset ID: ${assetId}`)
            }
            ipfsUrl={ipfsHash ? `https://ipfs.io/ipfs/${ipfsHash}` : ""}
          />
        </div>
      )}
    </main>
  );
};

const App: React.FC = () => {
  return (
    <WalletProvider>
      <div className="min-h-screen flex flex-col bg-gray-100">
        <Navbar />
        <Content />
      </div>
    </WalletProvider>
  );
};

export default App;
