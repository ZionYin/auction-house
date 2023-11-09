const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
// const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs")

const uri1 = "ipfs://bafybeibqv73fvudnhmjvo7leuvu7oka2ig3igseawfhchtn4yg65mxdu3y";
const uri2 = "ipfs://bafybeif6qxkq3kxlm4ml5p5j6umbi2cn5yznt3yb3iaiimicvat5tqbawm";

describe("AuctionItem contract unit tests", function () {
    async function deployFixture() {
        const [owner, user1] = await ethers.getSigners();
        const item = await ethers.deployContract("AuctionItem", [owner.address, "Test", "TEST"]);
        return { item, owner, user1 };
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
        const { item, user1 } = await loadFixture(deployFixture);
        await expect(item.connect(user1).safeMint(user1.address, uri1))
        .to.be.revertedWithCustomError(item, "OwnableUnauthorizedAccount");
    });
    it("Should show the correct owner of a NFT", async function () {
        const { item, owner } = await loadFixture(deployFixture);
        await item.safeMint(owner.address, uri1);
        expect(await item.ownerOf(0)).to.equal(owner.address);
    });
    it("Should allow owner to transfer a NFT", async function () {
        const { item, owner, user1 } = await loadFixture(deployFixture);
        await item.safeMint(owner.address, uri1);
        await item.safeTransferFrom(owner.address, user1.address, 0);
        expect(await item.ownerOf(0)).to.equal(user1.address);
    });
    it("Should show the correct URI of a NFT", async function () {
        const { item, owner } = await loadFixture(deployFixture);
        await item.safeMint(owner.address, uri1);
        expect(await item.tokenURI(0)).to.equal(uri1);
    });
    it("Should show the correct supportsInterface", async function () {
        const { item, owner } = await loadFixture(deployFixture);
        expect(await item.supportsInterface("0x5b5e139f")).to.equal(true); // interface id for erc721
        expect(await item.supportsInterface("0x780e9d63")).to.equal(false); // interface id for erc721Enumerable
    });
});
