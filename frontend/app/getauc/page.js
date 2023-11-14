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


export default function GetAUC() {
  const [mintAmount, setMintAmount] = useState(0);
  const [balance, setBalance] = useState(0);

  const fetchData = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);
    const balance = await tokenContract.balanceOf(await signer.getAddress());
    setBalance(balance.toString());
  }

  const handleMintToken = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);
    const tx = await tokenContract.mint(mintAmount);
    await tx.wait();
  };

  useEffect(() => {
    fetchData();
  }, []);

  



  return (
    // show balance
    // text input for mint amount
    // mint button
    // show auctions
    // cancel button for each auction
    // lower price button for each auction
    // end auction button for each auction
    // bid button for each auction
    // text input for bid amount for each auction
    <main className={`flex min-h-screen flex-col items-center p-24`}>
      <button className="btn btn-primary" onClick={handleMintToken}>Mint</button>
      <input
        className="input input-bordered"
        type="number"
        value={mintAmount}
        onChange={(e) => setMintAmount(e.target.value)}
      />
      <h1 className="text-2xl font-bold">Balance: {balance} AUC</h1>
    </main>
  );
}
