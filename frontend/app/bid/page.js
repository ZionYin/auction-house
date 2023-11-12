"use client";

import { useState, useEffect } from "react";
import { CreateAuctionComponent } from "../components/CreateAuctionComponent";
import { ItemCard } from "../components/ItemCard";



export default function bid() {
  
  

  

  return (
    <main
      className={`flex min-h-screen flex-col items-center p-24`}
    >
        <ItemCard item={{name:"test", description:"test"}}/>

    </main>
  );
}
