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
import { AdminComponent } from "@/app/components/AdminComponent.js";

export default function admin() {
  

  return (
    <main
      className={`flex min-h-screen flex-col p-24`}
    >
      <FeeComponent />
      <AdminComponent />
    </main>
  );
}
