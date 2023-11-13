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

export function AdminComponent() {
  const [admin, setAdmin] = useState("");
  const [managers, setManagers] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const houseContract = new ethers.Contract(houseAddress, houseABI, signer);
      const admin = await houseContract.admin();
      // const managers = await houseContract.managers(0);
      return { admin, managers };
    };

    getData().then((data) => {
      setAdmin(data.admin);
      // setManagers(data.managers);
    });
  }, []);

  const test = async () => {
    console.log(admin);
    console.log(managers);
  };

  return (
    // show current admin and managers
    // allow admin to change admin
    // allow admin to add manager
    // allow admin to remove manager

    <div>
      <div className="stats shadow">
        <div className="stats bg-primary text-primary-content">
          <div className="stat">
            <div className="stat-title">Current admin</div>
            <div className="stat-value">{admin}</div>
          </div>
        </div>
      </div>
      <div className="card shadow-lg compact side bg-base-100">
        <div className="card-body">
          <div className="form-control">
            <label className="label">
              <span className="label-text">New admin</span>
            </label>
            <input
              type="text"
              placeholder="New admin"
              className="input input-bordered"
              onChange={(e) => setAdmin(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={test}>
            Change admin
          </button>
        </div>
      </div>
    </div>
  );
}
