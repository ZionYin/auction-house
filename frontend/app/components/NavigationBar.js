"use client";

import { MetaMaskButton } from "@metamask/sdk-react-ui";

export const NavigationBar = () => {
  return (
    <header className="navbar mb-2 shadow-lg bg-neutral text-neutral-content rounded-box">
      <div className="flex-none">
        <button className="btn btn-square btn-ghost">
          <span className="text-lg font-bold">👤</span>
        </button>
      </div>
      <div className="flex-1 hidden px-2 mx-2 lg:flex">
        <span className="text-lg font-bold">
          <a href="/admin">Admin</a>
        </span>
      </div>
      <div className="flex-none hidden lg:flex">
        <button className="btn btn-square btn-ghost">
          <span className="text-lg font-bold">🏠</span>
        </button>
      </div>
      <div className="flex-1 hidden px-2 mx-2 lg:flex">
        <span className="text-lg font-bold">
          <a href="/">Auction House</a>
        </span>
      </div>

      <div className="flex-none">
        <MetaMaskButton />
      </div>
    </header>
  );
};
