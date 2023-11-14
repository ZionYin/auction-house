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


export function ItemCardSeller({ item }) {

  const [amount, setAmount] = useState(0);

  const handleCancel = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const houseContract = new ethers.Contract(houseAddress, houseABI, signer);
    const tx = await houseContract.cancelAuction(item.key);
    await tx.wait();
  }

  const handleLowerPrice = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const houseContract = new ethers.Contract(houseAddress, houseABI, signer);
    const tx = await houseContract.lowerStartingPrice(item.key, amount);
    await tx.wait();
  }

  const handleEnd = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const houseContract = new ethers.Contract(houseAddress, houseABI, signer);
    const tx = await houseContract.endAuction(item.key);
    await tx.wait();
  }





  return (
    <div className="flex flex-col justify-center items-center border-2 border-black rounded-lg p-4 m-4">
      <h1 className="text-2xl font-bold">Item</h1>
      <p className="text-xl">Seller: {item.seller}</p>
      <p className="text-xl">Item Contract: {item.itemContract}</p>
      <p className="text-xl">Item ID: {item.itemId.toString()}</p>
      <p className="text-xl">Starting Price: {item.startingPrice.toString()}</p>
      <p className="text-xl">End Time: {item.endTime.toString()}</p>
      <p className="text-xl">Current Bid: {item.currentBid.toString()}</p>
      <p className="text-xl">Current Bidder: {item.currentBidder}</p>
        <p className="text-xl">Auction ID: {item.key.toString()}</p>
        <h1 className="text-2xl font-bold">Actions</h1>
        <input
            className="input input-bordered"
            type="number"
            onChange={(e) => setAmount(e.target.value)}
            placeholder="lower price"
        />
      <button className="btn btn-primary" onClick={handleCancel}>Cancel</button>
      <button className="btn btn-primary" onClick={handleLowerPrice}>Lower Price</button>
      <button className="btn btn-primary" onClick={handleEnd}>End</button>
    </div>
  );
}
