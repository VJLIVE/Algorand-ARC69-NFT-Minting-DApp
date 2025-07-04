import { useEffect, useState } from "react";
import "./App.css";
import { peraWallet } from "./utils/algorand";
import NFTForm from "./components/NFTForm";
import PinataUpload from "./utils/PinataUpload";

function App() {
  const [account, setAccount] = useState<string>("");
  const [ipfsHash, setIpfsHash] = useState<string>("");

  const connectWallet = async () => {
    try {
      const accounts = await peraWallet.connect();
      setAccount(accounts[0]);
    } catch (err) {
      alert("Failed to connect wallet. Make sure Pera Wallet is installed.");
      console.error(err);
    }
  };

  useEffect(() => {
    peraWallet.reconnectSession().then((accounts) => {
      if (accounts.length) {
        setAccount(accounts[0]);
      }
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 space-y-6">
      {!account ? (
        <button
          onClick={connectWallet}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="w-full max-w-md space-y-4">
          <div className="text-center">
            Connected Account: <b>{account}</b>
          </div>

          <PinataUpload onUpload={(hash) => setIpfsHash(hash)} />

          <NFTForm
            account={account}
            onComplete={(assetId) =>
              alert(`NFT Created successfully! Asset ID: ${assetId}`)
            }
            ipfsUrl={ipfsHash ? `https://ipfs.io/ipfs/${ipfsHash}` : ""}
          />
        </div>
      )}
    </div>
  );
}

export default App;