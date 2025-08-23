import React from "react";

const NFTResult: React.FC<{ assetId: number }> = ({ assetId }) => (
  <div className="max-w-md mx-auto bg-green-500/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-green-400/30 flex flex-col items-center">
    <span className="text-4xl mb-2 animate-bounce">🎉</span>
    <h2 className="text-2xl font-bold text-green-300 mb-2 text-center drop-shadow">NFT Created!</h2>
    <p className="text-lg text-green-200 mb-2">Asset ID:</p>
    <strong className="text-xl text-green-400 font-mono mb-4">{assetId}</strong>
    <a
      href={`https://testnet.explorer.perawallet.app/asset/${assetId}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-green-400 text-sm px-4 py-2 rounded-full bg-green-400/10 hover:bg-green-400/30 transition font-semibold shadow"
    >
      View on Explorer
    </a>
  </div>
);

export default NFTResult;
