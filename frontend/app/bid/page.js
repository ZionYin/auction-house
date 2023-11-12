"use client";

import { useState, useEffect } from "react";
import { CreateAuctionComponent } from "../components/CreateAuctionComponent";



export default function create() {
  const [contractAddress, setContractAddress] = useState("");
  const [itemId, setItemId] = useState("");

  const handleCallbackSetAddress = (contractAddress) => {
    setContractAddress(contractAddress);
  };

  const handleCallbackSetId = (itemId) => {
    setItemId(itemId);
  }

  

  return (
    <main
      className={`flex min-h-screen flex-col items-center p-24`}
    >
        <DeployContractComponent parentCallbackSetAddress={handleCallbackSetAddress}/>
        <MintItemComponent parentCallbackSetId={handleCallbackSetId} contractAddress={contractAddress}/>
        <CreateAuctionComponent contractAddress={contractAddress} itemId={itemId}/>
    </main>
  );
}
