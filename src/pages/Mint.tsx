import React, { useState } from "react";
import { useWallet } from "../context/WalletContext";
import NFTForm from "../components/NFTForm";
import PinataUpload from "../utils/PinataUpload";

const MintPage: React.FC = () => {
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

          <PinataUpload onUpload={(hash) => setIpfsHash(hash)} />

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

export default MintPage;
