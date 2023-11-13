"use client";

import { MetaMaskButton } from "@metamask/sdk-react-ui";
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
    <main className={`flex min-h-screen flex-col items-center justify-between p-24`}>
      <h1 className="text-4xl font-bold text-center">test</h1>
      <div>
        <MetaMaskButton />
      </div>
      <br />
      <Link href="/getauc">getauc</Link>
      <Link href="/admin">admin</Link>
      <Link href="/create">create</Link>
      <Link href="/bid">bid</Link>
      <br />

    </main>
  );
}
