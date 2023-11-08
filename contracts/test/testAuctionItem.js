const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
// const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs")

const uri1 = "ipfs://bafybeibqv73fvudnhmjvo7leuvu7oka2ig3igseawfhchtn4yg65mxdu3y";
const uri2 = "ipfs://bafybeif6qxkq3kxlm4ml5p5j6umbi2cn5yznt3yb3iaiimicvat5tqbawm";

describe("AuctionItem contract", function () {
    async function deployFixture() {
        const [owner, addr1] = await ethers.getSigners();
        const item = await ethers.deployContract("AuctionItem", [owner.address, "Test", "TEST"]);
        return { item, owner, addr1 };
    }
    it("Should allow owner to mint NFTs", async function () {
        const { item, owner } = await loadFixture(deployFixture);
        await expect(item.safeMint(owner.address, uri1))
        .to.emit(item, "ItemMinted")
        .withArgs(owner.address, 0);

        await expect(item.safeMint(owner.address, uri2))
        .to.emit(item, "ItemMinted")
        .withArgs(owner.address, 1);
    });
    it("Should not allow non-owner to mint a NFT", async function () {
        const { item, addr1 } = await loadFixture(deployFixture);
        await expect(item.connect(addr1).safeMint(addr1.address, uri1))
        .to.be.revertedWithCustomError(item, "OwnableUnauthorizedAccount");
    });
});
