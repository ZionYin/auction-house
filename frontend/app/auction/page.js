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
import Link from "next/link";
import { NFTStorage } from "nft.storage";

export default function auction() {

    const test = async () => {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const houseContract = new ethers.Contract(houseAddress, houseABI, provider);
        console.log("houseContract", houseContract);

        const auctions = await houseContract.auctions(1);
        console.log("auctions", auctions);
    };
  

  

  return (
    <main
      className={`flex min-h-screen flex-col items-center p-24`}
    >
        <button onClick={test}>test</button>
        
    </main>
  );
}
