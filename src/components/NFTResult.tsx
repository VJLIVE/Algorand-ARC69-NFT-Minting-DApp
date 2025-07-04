import React from "react";

const NFTResult: React.FC<{ assetId: number }> = ({ assetId }) => (
  <div className="p-4 bg-green-100 rounded shadow">
    🎉 NFT Created! Asset ID: <strong>{assetId}</strong>
  </div>
);

export default NFTResult;
