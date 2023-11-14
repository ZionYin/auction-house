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



export function CreateAuctionComponent({ contractAddress, itemId }) {

    useEffect(() => {
        setInputAddress(contractAddress);
        setInputId(itemId);
    }, [contractAddress, itemId]);

    const [inputAddress, setInputAddress] = useState(contractAddress?contractAddress:"");
    const [inputId, setInputId] = useState(itemId?itemId:"0");
    const [price, setPrice] = useState(0);
    const [duration, setDuration] = useState(0);


  const handleStartAuction = async () => {
    console.log("inputAddress", inputAddress);
    console.log("inputId", inputId);
    console.log("price", price);
    console.log("duration", duration);
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const itemContract = new ethers.Contract(inputAddress, itemABI, signer);
    const houseContract = new ethers.Contract(houseAddress, houseABI, signer);
    // first authorize the contract to transfer the item
    const tx1 = await itemContract.approve(houseAddress, inputId);
    await tx1.wait();

    // then start the auction
    const tx2 = await houseContract.startAuction(inputAddress, inputId, price, duration);
    await tx2.wait();

    
    

  }


  return (
    <div className="flex justify-normal flex-col">
        <div>Contract Address to start an auction</div>
        <input
              type="text"
              defaultValue={contractAddress}
              className="input input-bordered w-full max-w-xs"
              onInput={(e) => setInputAddress(e.target.value)}
            />
        <div>item ID</div>
        <input
              type="text"
              defaultValue={itemId.toString()}
              className="input input-bordered w-full max-w-xs"
              onInput={(e) => setInputId(e.target.value)}
            />
        <div>Starting Price</div>
        <input
              type="number"
              defaultValue="0"
              className="input input-bordered w-full max-w-xs"
              onInput={(e) => setPrice(e.target.value)}
            />
        <div>duration (Unit second)</div>
        <input
              type="number"
              defaultValue="0"
              className="input input-bordered w-full max-w-xs"
              onInput={(e) => setDuration(e.target.value)}
            />
      <button onClick={handleStartAuction} className="btn">Start Auction</button>
      
    </div>
  );
}
