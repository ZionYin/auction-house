"use client";

import { useState, useEffect } from "react";
import { ItemCardSeller } from "@/app/components/ItemCardSeller.js";
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
    const auctions = await houseContract.getAuctionsBySeller(await signer.getAddress());
    return auctions;
  }

  const handleFetchAuctions = async () => {
    const results = await fetchAuctions();
    const existingAuctions = results.filter((item) => item[4] > 0); // filter out deleted items
    const auctions = existingAuctions.map((auction) => {
      return {
        key: auction[0],
        seller: auction[1],
        itemContract: auction[2],
        itemId: auction[3],
        startingPrice: auction[4],
        endTime: auction[5],
        currentBid: auction[6],
        currentBidder: auction[7],
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
          <ItemCardSeller item={item} key={item.key} />
        ))}
      </div>
    </main>
  );
}
