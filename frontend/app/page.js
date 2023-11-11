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
  const [mintAmount, setMintAmount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (window.ethereum) {
      setIsConnected(true);
    }
  });

  const handleMintToken = async () => {
    console.log("mintAmount", mintAmount);
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);
    const tx = await tokenContract.mint(mintAmount);
    await tx.wait();
  };

  const handleCreateItemContract = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const itemFactory = new ethers.ContractFactory(
      itemABI,
      itemBytecode,
      signer
    );
    console.log("signer address", signer.address);
    const itemContract = await itemFactory.deploy(
      signer.address,
      "test",
      "test"
    );
    await itemContract.deployed();
    const address = await itemContract.getAddress();
    console.log("itemContract", address);
  };

  const test = async () => {
    console.log("ether connected", window.ethereum.isConnected());

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    console.log("tokenAddress", tokenAddress);
    console.log("tokenABI", tokenABI);
    console.log("signer", signer);

    const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);

    const name = await tokenContract.name();

    console.log("name", name);
  };

  return (
    <main className={`flex min-h-screen flex-col items-center justify-between p-24`}>
      <h1 className="text-4xl font-bold text-center">test</h1>
      <div>
        <MetaMaskButton />
      </div>
      <button onClick={test} className="btn btn-primary">
        test
      </button>
      <br />
      <Link href="/getauc">getauc</Link>
      <Link href="/admin">admin</Link>
      <br />

      <button onClick={handleCreateItemContract}>create item contract</button>
    </main>
  );
}
