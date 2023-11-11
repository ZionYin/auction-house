"use client";

import { Inter } from "next/font/google";
import { MetaMaskUIProvider, MetaMaskButton } from "@metamask/sdk-react-ui";
import { ethers } from "ethers";
import {
  tokenABI,
  itemABI,
  houseABI,
  tokenAddress,
  houseAddress,
  itemBytecode,
} from "../interact.js";
import { useState, useEffect } from "react";
import { NFTStorage } from 'nft.storage'

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [mintAmount, setMintAmount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (window.ethereum) {
      setIsConnected(true);
    }
  });

  const handleMintToken = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = provider.getSigner();
    const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);
    const tx = await tokenContract.mint(mintAmount);
    await tx.wait();
  };

  const handleCreateItemContract = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const itemFactory = new ethers.ContractFactory(itemABI, itemBytecode, signer);
    console.log("signer address", signer.address);
    const itemContract = await itemFactory.deploy(signer.address, "test", "test");
    await itemContract.deployed();
    const address = await itemContract.getAddress();
    console.log("itemContract", address);
  }

  const test = async () => {
    console.log("ether connected", window.ethereum.isConnected());

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = provider.getSigner();
    console.log("tokenAddress", tokenAddress);
    console.log("tokenABI", tokenABI);
    console.log("signer", signer);

    const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);

    const name = await tokenContract.name();

    console.log("name", name);
  };

  return (
    <MetaMaskUIProvider
      sdkOptions={{
        dappMetadata: {
          name: "My dapp",
        },
      }}
    >
      <main
        className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
      >
        <h1 className="text-4xl font-bold text-center">test</h1>
        <div>
          <MetaMaskButton />
        </div>
        <button onClick={test}>test</button>
        <div className="form-group">
          <label htmlFor="mintAmount">mint amount</label>
          <input
            type="number"
            id="mintAmount"
            value={mintAmount}
            onChange={(e) => setMintAmount(e.target.value)}
          />
          <button onClick={handleMintToken}>mint</button>
          <button onClick={handleCreateItemContract}>create item contract</button>
        </div>
      </main>
    </MetaMaskUIProvider>
  );
}
