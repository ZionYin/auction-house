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
import { NFTStorage } from "nft.storage";


export function MintItemComponent({ contractAddress }) {

    const [file, setFile] = useState(null);

  const handleMintItem = async () => {
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
    parentCallback(address);
  };

  return (
    <div>
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">Pick a file</span>
        </label>
        <input
          type="file"
          className="file-input file-input-bordered w-full max-w-xs"
        />
        <button onClick={handleMintItem} className="btn">
        Mint Item
      </button>
      </div>
      
    </div>
  );
}
