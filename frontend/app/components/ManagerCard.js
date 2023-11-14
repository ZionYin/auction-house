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


export function ManagerCard({ address, key }) {



  const handleRemove = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const houseContract = new ethers.Contract(houseAddress, houseABI, signer);
    const tx = await houseContract.removeManager(address);
    await tx.wait();
  }

  return (
    <div className="card shadow-lg compact side bg-base-100">
      <div className="card-body">
        <h2 className="card-title">Manager Address</h2>
        <p className="text-gray-700 text-sm">{address}</p>
        <div className="card-actions">
          <button className="btn btn-secondary" onClick={handleRemove}>Remove</button>
        </div>
      </div>
    </div>
  );
}
