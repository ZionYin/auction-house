// const { ethers, network, run } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  const tokenFactory = await ethers.getContractFactory("AuctionToken");
  const token = await tokenFactory.deploy();
  await token.waitForDeployment();
  console.log("Token contract address:", token.target);

  const auctionFactory = await ethers.getContractFactory("AuctionHouse");
  const auction = await auctionFactory.deploy(token.target, deployer.address);
  await auction.waitForDeployment();
  console.log("Auction House contract address:", auction.target);

  console.log("Verifying contracts on etherscan...");
  await hre.run("verify:verify", {
    address: token.target,
    constructorArguments: [],
  });
  await hre.run("verify:verify", {
    address: auction.target,
    constructorArguments: [token.target, deployer.address],
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });