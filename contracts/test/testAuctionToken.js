const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

describe("AuctionToken contract unit tests", function () {
    async function deployFixture() {
        const [owner, user1, user2] = await ethers.getSigners();
        const token = await ethers.deployContract("AuctionToken");
        return { token, owner, user1 };
    }
    it("Should allow anyone to mint tokens", async function () {
        const { token, owner, user1 } = await loadFixture(deployFixture);
        await token.mint(100);
        expect(await token.balanceOf(owner.address)).to.equal(100);
        await token.connect(user1).mint(200);
        expect(await token.balanceOf(user1.address)).to.equal(200);
    });
    it("Should allow users to transfer tokens", async function () {
        const { token, owner, user1 } = await loadFixture(deployFixture);
        await token.mint(100);
        await expect(token.transfer(user1.address, 50))
        .to.changeTokenBalances(token, [owner, user1], [-50, 50]);
    });

});
