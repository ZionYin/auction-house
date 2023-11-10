const { network } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  const tokenFactory = await ethers.getContractFactory("AuctionToken");
  const token = await tokenFactory.deploy();
  console.log("Token contract address:", token.target);

  const auctionFactory = await ethers.getContractFactory("AuctionHouse");
  const auction = await auctionFactory.deploy(token.target, deployer.address);
  console.log("Auction House contract address:", auction.target);

  if (network.name === "sepolia") {
    console.log("Waiting for block confirmations...");
    await auction.deploymentTransaction().wait(5);

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
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
