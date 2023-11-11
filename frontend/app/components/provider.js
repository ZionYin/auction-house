"use client";

import React from "react";
import { MetaMaskUIProvider } from "@metamask/sdk-react-ui";

export default function Provider({ children }) {
  return (
    <React.StrictMode>
      <MetaMaskUIProvider
        sdkOptions={{
          dappMetadata: {
            name: "Auction House dapp",
          },
        }}
      >
        {children}
      </MetaMaskUIProvider>
    </React.StrictMode>
  );
}
