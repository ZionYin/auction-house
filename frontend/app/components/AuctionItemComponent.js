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
import { NFTStorage } from "nft.storage";

const NFT_STORAGE_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEI0MDM3MDBGNmY5ODI3MzQxNTYyNzI3OWY5QjFFYjE3ZkU4ZjIyMmUiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY5OTc0MjU3MTgzMiwibmFtZSI6IkEyIn0.Z9RgDWec-pMqRbDHalFECvgeC_aUVPEVylmaHzU_TEY";


export function AuctionItemComponent({ contractAddress }) {

    const [file, setFile] = useState(null);
    const [inputAddress, setInputAddress] = useState("");

  const handleMintItem = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const itemContract = new ethers.Contract(inputAddress?inputAddress:contractAddress, itemABI, signer);
    const nftStorage = new NFTStorage({ token: NFT_STORAGE_API_KEY });
    console.log("key", NFT_STORAGE_API_KEY)
    const metadata = await nftStorage.store({
      name: "test",
      description: "test",
      image: file,
    });
    console.log("metadata", metadata);
    const tx = await itemContract.safeMint(await signer.getAddress(), metadata.url);
    await tx.wait();
  };

  return (
    <div>
        <div>Contract Address(Be sure to save it!!!)</div>
        <input
              type="text"
              placeholder={contractAddress}
              className="input input-bordered w-full max-w-xs"
              onInput={(e) => setInputAddress(e.target.value)}
            />
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">Pick a file</span>
        </label>
        <input
          type="file"
          className="file-input file-input-bordered w-full max-w-xs"
            onChange={(e) => setFile(e.target.files[0])}
        />
        <button onClick={handleMintItem} className="btn">
        Mint Item
      </button>
      </div>
      
    </div>
  );
}
