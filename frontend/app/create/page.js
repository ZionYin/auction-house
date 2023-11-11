"use client";

import { DeployContractComponent } from "@/app/components/DeployContractComponent.js";
import { MintItemComponent } from "@/app/components/MintItemComponent.js";
import { useState, useEffect } from "react";



export default function create() {
  const [contractAddress, setContractAddress] = useState("");

  const handleCallback = (contractAddress) => {
    setContractAddress(contractAddress);
  };

  

  return (
    <main
      className={`flex min-h-screen flex-col items-center p-24`}
    >
        <DeployContractComponent parentCallback={handleCallback}/>
        <div>{contractAddress}test</div>
        <MintItemComponent contractAddress={contractAddress}/>
    </main>
  );
}
