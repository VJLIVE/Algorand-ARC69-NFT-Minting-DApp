import { useState } from "react";
import { useWallet } from "../context/WalletContext";
import NFTForm from "../components/NFTForm";
import PinataUpload from "../utils/PinataUpload";

const MintPage = () => {
  const { account } = useWallet();
  const [ipfsHash, setIpfsHash] = useState("");

  if (!account) {
    return (
      <div className="p-6 text-center text-red-600">
        Please connect your wallet to mint NFTs.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto space-y-4">
      <div className="text-center">
        Connected Account: <b>{account}</b>
      </div>
      <PinataUpload onUpload={setIpfsHash} />
      <NFTForm
        account={account}
        ipfsUrl={ipfsHash ? `https://ipfs.io/ipfs/${ipfsHash}` : ""}
        onComplete={(assetId) =>
          alert(`🎉 NFT Created successfully! Asset ID: ${assetId}`)
        }
      />
    </div>
  );
};

export default MintPage;
