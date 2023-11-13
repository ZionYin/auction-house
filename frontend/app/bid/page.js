"use client";

import { useState, useEffect } from "react";
import { ItemCard } from "../components/ItemCard";

export default function bid() {
  useEffect(() => {
    async function fetchAuctions() {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const houseContract = new ethers.Contract(houseAddress, houseABI, signer);
      
    }
    fetchAuctions();
  }, []);

  return (
    <main className={`flex min-h-screen flex-col items-center p-24`}>
      <ItemCard item={{ name: "test", description: "test" }} />
    </main>
  );
}
