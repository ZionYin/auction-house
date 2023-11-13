"use client";

import { useState, useEffect } from "react";
import { ItemCard } from "../components/ItemCard";
import {
  tokenABI,
  itemABI,
  houseABI,
  tokenAddress,
  houseAddress,
  itemBytecode,
} from "@/interact.js";
import { ethers } from "ethers";

export default function bid() {

  const [auctions, setAuctions] = useState([]);

  const fetchAuctions = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const houseContract = new ethers.Contract(houseAddress, houseABI, signer);
    const auctions = await houseContract.getAuctions();
    return auctions;
  }

  const handleFetchAuctions = async () => {
    const results = await fetchAuctions();
    const existingAuctions = results.filter((item) => item[4] > 0); // filter out deleted items
    const auctions = existingAuctions.map((auction, index) => {
      return {
        seller: auction[0],
        itemContract: auction[1],
        itemId: auction[2],
        startingPrice: auction[3],
        endTime: auction[4],
        currentBid: auction[5],
        currentBidder: auction[6],
        key: index,
      };
    });
    setAuctions(auctions);
    console.log(auctions);
  }



  

  return (
    <main className={`flex min-h-screen flex-col items-center p-24`}>
      <button className="btn btn-primary" onClick={handleFetchAuctions}>Get Auctions</button>
      <div className="flex justify-center flex-col">
        {auctions.map((item) => (
          <ItemCard item={item} key={item.key} />
        ))}
      </div>
    </main>
  );
}
