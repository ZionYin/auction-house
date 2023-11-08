const { loadFixture } = require("ethereum-waffle");
const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Token contract", function () {
    async function deployFixture() {
        const [owner, addr1] = await ethers.getSigners();
        const token = await ethers.deployContract("AuctionToken");
        return { token, owner, addr1 };
    }
    it("Should allow owner to mint", async function () {
        const { token, owner } = await loadFixture(deployFixture);
        await token.mint(owner.address, 100);
        expect(await token.balanceOf(owner.address)).to.equal(100);
    });
    it("Should allow anyone to mint", async function () {
        const { token, addr1 } = await loadFixture(deployFixture);
        await token.mint(addr1.address, 200);
        expect(await token.balanceOf(addr1.address)).to.equal(100);
    });
});
