async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  const token = await ethers.deployContract("AuctionToken");
  console.log("Token contract address:", await token.getAddress());

  const auction = await ethers.deployContract("AuctionHouse", [token.getAddress(), deployer.address]);
  console.log("Auction House contract address:", await auction.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });