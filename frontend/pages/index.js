import { Inter } from "next/font/google";
import {
  MetaMaskUIProvider,
  MetaMaskButton,
} from "@metamask/sdk-react-ui";
import { ethers } from "ethers";
import { useState, useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {

  // useEffect(() => {
  //   console.log("sdk", sdk);
  //   console.log("connected", connected);
  //   console.log("connecting", connecting);
  //   console.log("provider", provider);
  //   console.log("chainID", chainID);
  // });

  const test = async () => {
    console.log("ether connected", window.ethereum.isConnected());
  }

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
          <MetaMaskButton></MetaMaskButton>
        </div>
        <button onClick={test}>test</button>
      </main>
    </MetaMaskUIProvider>
  );
}
