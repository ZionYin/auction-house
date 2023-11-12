"use client";

import { ethers } from "ethers";
import {
  tokenABI,
  itemABI,
  houseABI,
  tokenAddress,
  houseAddress,
  itemBytecode,
} from "@/interact.js";
import { useState, useEffect } from "react";

export function DeployContractComponent({parentCallbackSetAddress}) {
  const [contractName, setContractName] = useState("");
  const [contractSymbol, setContractSymbol] = useState("");
  const [contractAddress, setContractAddress] = useState("");

  const handleCreateItemContract = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const itemFactory = new ethers.ContractFactory(
      itemABI,
      itemBytecode,
      signer
    );
    const itemContract = await itemFactory.deploy(
      signer.address,
        contractName,
        contractSymbol
    );
    await itemContract.waitForDeployment();
    const address = await itemContract.getAddress();
    console.log("itemContract", address);
    setContractAddress(address);
    parentCallbackSetAddress(address);
  };

  return (
    <div className="flex justify-normal flex-col">
      <form>
        <div className="grid grid-cols-2">
            <div className="form-group">
                <label htmlFor="contractName">contract name</label>
                <input
                type="text"
                id="contractName"
                value={contractName}
                placeholder="i.e. Bread"
                onChange={(e) => setContractName(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="contractSymbol">contract symbol</label>
                <input
                type="text"
                id="contractSymbol"
                value={contractSymbol}
                placeholder="i.e. BRD"
                onChange={(e) => setContractSymbol(e.target.value)}
                />
            </div>
        </div>
      </form>
      <button onClick={handleCreateItemContract} className="btn">create item contract</button>
        
    </div>
  );
}
