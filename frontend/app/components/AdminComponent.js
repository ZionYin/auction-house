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
import { ManagerCard } from "./ManagerCard";

export function AdminComponent() {
  const [admin, setAdmin] = useState("");
  const [newAdmin, setNewAdmin] = useState("");
  const [managers, setManagers] = useState([]);
  const [newManager, setNewManager] = useState("");

  const getData = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const houseContract = new ethers.Contract(houseAddress, houseABI, signer);
    const admin = await houseContract.admin();
    const managers = await houseContract.getManagers();
    setAdmin(admin);
    setManagers(managers);
    // console.log(managers[0]);
  };

  useEffect(() => {
    getData();
  }, []);

  const handleChangeAdmin = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const houseContract = new ethers.Contract(houseAddress, houseABI, signer);
    const tx = await houseContract.changeAdmin(newManager);
    await tx.wait();
  };

  const handleAddManager = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const houseContract = new ethers.Contract(houseAddress, houseABI, signer);
    const tx = await houseContract.addManager(newManager);
    await tx.wait();
  };

  return (
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
              placeholder={admin}
              className="input input-bordered"
              onChange={(e) => setNewAdmin(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={handleChangeAdmin}>
            Change admin
          </button>
        </div>
      </div>
      <div className="card shadow-lg compact side bg-base-100">
        <div className="card-body">
          <div className="form-control">
            <label className="label">
              <span className="label-text">New manager</span>
            </label>
            <input
              type="text"
              placeholder="New manager"
              className="input"
              onChange={(e) => setNewManager(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={handleAddManager}>
            Add manager
          </button>
        </div>
      </div>
      <br />
      {managers.map((manager, index) => (
        <ManagerCard address={manager} key={index} />
      ))}
    </div>
  );
}
