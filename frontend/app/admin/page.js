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
import { FeeComponent } from "@/app/components/FeeComponent.js";

export default function admin() {
  

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24`}
    >
      <FeeComponent />
    </main>
  );
}
