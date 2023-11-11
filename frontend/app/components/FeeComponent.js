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

export function FeeComponent() {
  const [houseContract, setHouseContract] = useState(null);
  const [feePercentage, setfeePercentage] = useState(0);
  const [admin, setAdmin] = useState("");
  const [managers, setManagers] = useState([]);
  const [fees] = useState(0);
  const [withdrawalAmount, setWithdrawalAmount] = useState(0);

  useEffect(() => {
    const getData = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const houseContract = new ethers.Contract(houseAddress, houseABI, signer);
      setHouseContract(houseContract);
      const feePercentage = await houseContract.feePercentage();
      const admin = await houseContract.admin();
      // const managers = await houseContract.managers();
      // const fees = await houseContract.getFees();
      return { feePercentage, admin };
    };

    getData().then((data) => {
      setfeePercentage(data.feePercentage);
      setAdmin(data.admin);
      setManagers(data.managers);
    });
  }, []);

  const handleChangefeePercentage = async () => {
    const tx = await houseContract.setFeePercentage(feePercentage);
    await tx.wait();
  };

  const handleWithdrawFees = async () => {
    const tx = await houseContract.withdrawFees(withdrawalAmount);
    await tx.wait();
  }

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24`}
    >
      <div className="stats shadow">
        <div className="stats bg-primary text-primary-content">
          <div className="stat">
            <div className="stat-title">Current feePercentage</div>
            <div >
            <input
              type="text"
              placeholder={feePercentage}
              className="input input-bordered w-2/6 max-w-xs"
              onInput={(e) => setfeePercentage(e.target.value)}
            />
            <span>/10000</span>

            </div>
            
            <div className="stat-actions">
              <button
                className="btn btn-sm btn-success"
                onClick={handleChangefeePercentage}
              >
                Change fee Percentage
              </button>
            </div>
          </div>

          <div className="stat">
            <div className="stat-title">Current balance</div>
            <div className="stat-value">{fees} AUC</div>
            <input
              type="text"
              placeholder={fees}
              className="input input-bordered w-full max-w-xs"
              onInput={(e) => setWithdrawalAmount(e.target.value)}
            />
            <div className="stat-actions">
              <button className="btn btn-sm" onClick={handleWithdrawFees}>Withdrawal</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
