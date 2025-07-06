const HomePage = () => {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Welcome to the Algorand NFT DApp 🚀</h1>
      <p className="mb-2">Features of this DApp:</p>
      <ul className="list-disc list-inside space-y-1">
        <li>✅ Connect your Algorand TestNet wallet using Pera Wallet.</li>
        <li>✅ Upload your artwork/media to IPFS via Pinata.</li>
        <li>✅ Mint ARC69-compliant NFTs directly on the Algorand blockchain.</li>
        <li>✅ View your minted asset’s Asset ID after minting.</li>
      </ul>
      <p className="mt-4 text-sm text-gray-600">
        Please connect your wallet first and head to the Mint NFT page to create your NFTs.
      </p>
    </div>
  );
};

export default HomePage;
