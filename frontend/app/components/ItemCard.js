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


export function ItemCard({ item }) {

  const [amount, setAmount] = useState(0);


  const handleBid = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const houseContract = new ethers.Contract(houseAddress, houseABI, signer);
    const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);
    const balance = await tokenContract.balanceOf(await signer.getAddress());
    if (balance < amount) {
      alert("Not enough balance");
      return;
    }
    const tx1 = await tokenContract.approve(houseAddress, amount);
    await tx1.wait();
    const tx2 = await houseContract.placeBid(item.key, amount);
    await tx2.wait();
  }





  return (
    <div className="card bordered shadow-lg w-72">
      <div className="card-body">
        <h2 className="card-title">Current Bid</h2>
        <p className="text-gray-700 text-sm">{item.currentBid.toString()}</p>
        <h2 className="card-title">Auction ID</h2>
        <p className="text-gray-700 text-sm">{item.key.toString()}</p>
        <h2 className="card-title">Auction End Time</h2>
        <p className="text-gray-700 text-sm">{item.endTime.toString()}</p>
        <div className="card-actions">
          <input
            type="number"
            className="input input-bordered w-1/2 max-w-xs"
            placeholder="0"
            onInput={(e) => setAmount(e.target.value)}
          ></input>
          <button className="btn btn-secondary" onClick={handleBid}>Bid</button>
        </div>
      </div>
    </div>
  );
}
