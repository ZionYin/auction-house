async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const token = await ethers.deployContract("AuctionToken");

  console.log("Token address:", await token.getAddress());

  const auction = await ethers.deployContract("Auction", [token.address]);

  console.log("Auction address:", await auction.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });