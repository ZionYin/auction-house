const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

describe("AuctionToken contract", function () {
    async function deployFixture() {
        const [owner, addr1, addr2] = await ethers.getSigners();
        const token = await ethers.deployContract("AuctionToken");
        return { token, owner, addr1 };
    }
    it("Should allow anyone to mint tokens", async function () {
        const { token, owner, addr1 } = await loadFixture(deployFixture);
        await token.mint(100);
        expect(await token.balanceOf(owner.address)).to.equal(100);
        await token.connect(addr1).mint(200);
        expect(await token.balanceOf(addr1.address)).to.equal(200);
    });
    it("Should allow users to transfer tokens", async function () {
        const { token, owner, addr1 } = await loadFixture(deployFixture);
        await token.mint(100);
        await expect(token.transfer(addr1.address, 50))
        .to.changeTokenBalances(token, [owner, addr1], [-50, 50]);
    });

});
