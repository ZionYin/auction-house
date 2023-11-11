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


export default function getAUC() {
  const [mintAmount, setMintAmount] = useState(0);

  const handleMintToken = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);
    const tx = await tokenContract.mint(mintAmount);
    await tx.wait();
  };

  const test = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = provider.getSigner();
    console.log("tokenAddress", tokenAddress);
    console.log("tokenABI", tokenABI);
    console.log("signer", signer);

    const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);

    const name = await tokenContract.name();

    console.log("name", name);

  };



  return (
    <main className={`flex min-h-screen flex-col items-center justify-between p-24`}>
        <div className="form-group">
        <label htmlFor="mintAmount">mint amount</label>
        <input
            type="number"
            id="mintAmount"
            value={mintAmount}
            onChange={(e) => setMintAmount(e.target.value)}
        />
        <button onClick={handleMintToken}>mint</button>
        </div>
    </main>
  );
}
