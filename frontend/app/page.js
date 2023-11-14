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


export default function Home() {
 

  return (
    <main className={`flex min-h-screen flex-col items-center justify-between p-24 `}>
      <Link href="/getauc" className={`text-xl font-bold hover:underline transition duration-300`}>Get free AUC!</Link>
      <Link href="/create" className={`text-xl font-bold hover:underline transition duration-300`}>✨ Create Auction</Link>
      <Link href="/bid" className={`text-xl font-bold hover:underline transition duration-300`}> Place a Bid</Link>
      <Link href="/myauctions" className={`text-xl font-bold hover:underline transition duration-300`}> My Auctions</Link>
</main>

  );
}
