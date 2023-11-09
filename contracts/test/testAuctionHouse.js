const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs")

const uri1 = "ipfs://bafybeibqv73fvudnhmjvo7leuvu7oka2ig3igseawfhchtn4yg65mxdu3y";
const uri2 = "ipfs://bafybeif6qxkq3kxlm4ml5p5j6umbi2cn5yznt3yb3iaiimicvat5tqbawm";
const uri3 = "ipfs://bafybeifst65vpdnla5o4jvmx75mqtejubxakucv2qch5f7iy6iz3u6h7zy";

describe("AuctionHouse contract unit tests", function () {
    async function deployFixture() {
        const [owner, user1, user2, user3] = await ethers.getSigners();
        const token = await ethers.deployContract("AuctionToken");
        await token.waitForDeployment();
        const item = await ethers.deployContract("AuctionItem", [user1.address, "Test", "TEST"]);
        const house = await ethers.deployContract("AuctionHouse", [token.target, owner.address]);
        return { token, item, house, owner, user1, user2, user3 };
    }

    describe("AuctionHouse fee tests", function () {
        it("Should have the correct default fee", async function () {
            const { house, owner } = await loadFixture(deployFixture);
            expect(await house.feePercentage()).to.equal(250);
        });
        it("Should allow admin to change fee", async function () {
            const { house, owner } = await loadFixture(deployFixture);
            await house.setFeePercentage(100);
            expect(await house.feePercentage()).to.equal(100);
        });
        it("Should not allow non-admin to change fee", async function () {
            const { house, owner, user1 } = await loadFixture(deployFixture);
            await expect(house.connect(user1).setFeePercentage(100))
            .to.be.revertedWith("Not an admin or manager");
        });
    });

    describe("AuctionHouse admin tests", function () {   
        it("Should allow admin to add manager", async function () {
            const { house, owner, user1 } = await loadFixture(deployFixture);
            await house.addManager(user1.address);
            expect(await house.isManager(user1.address)).to.equal(true);
        });
        it("Should not allow non-admin to add manager", async function () {
            const { house, owner, user1, user2 } = await loadFixture(deployFixture);
            await expect(house.connect(user1).addManager(user2.address))
            .to.be.revertedWith("Not an admin");
        });
        it("Should allow admin to remove manager", async function () {
            const { house, owner, user1 } = await loadFixture(deployFixture);
            await house.addManager(user1.address);
            await house.removeManager(user1.address);
            expect(await house.isManager(user1.address)).to.equal(false);
        });
        it("Should not allow non-admin to remove manager", async function () {
            const { house, owner, user1, user2 } = await loadFixture(deployFixture);
            await house.addManager(user1.address);
            await expect(house.connect(user1).removeManager(user2.address))
            .to.be.revertedWith("Not an admin");
        });
        it("Should allow admin to change admin", async function () {
            const { house, owner, user1 } = await loadFixture(deployFixture);
            await house.changeAdmin(user1.address);
            expect(await house.admin()).to.equal(user1.address);
        });
    });

});

// use root hook to setup accounts and share states between tests
describe("AuctionHouse contract workflow tests", function () {
    let owner, user1, user2, user3;
    let token, item, house;

    before(async function () {
        [owner, user1, user2, user3] = await ethers.getSigners();
        token = await ethers.deployContract("AuctionToken");
        await token.waitForDeployment();
        item = await ethers.deployContract("AuctionItem", [user1.address, "Test1", "TEST1"]);
        house = await ethers.deployContract("AuctionHouse", [token.target, owner.address]);
        token.connect(user1).mint(1000);
        token.connect(user2).mint(1000);
        token.connect(user3).mint(1000);
    });
    
    it("Should allow user to create auctions", async function () {
        item.connect(user1).safeMint(user1.address, uri1);
        item.connect(user1).safeMint(user1.address, uri2);
        item.connect(user1).safeMint(user1.address, uri3);
        await item.connect(user1).setApprovalForAll(house.target, true);
        await expect(house.connect(user1).startAuction(item.target, 0, 111, 10))
        .to.emit(house, "AuctionStarted")
        .withArgs(0, 111, anyValue);
        await expect(house.connect(user1).startAuction(item.target, 1, 222, 10))
        .to.emit(house, "AuctionStarted")
        .withArgs(1, 222, anyValue);
        await expect(house.connect(user1).startAuction(item.target, 2, 333, 10))
        .to.emit(house, "AuctionStarted")
        .withArgs(2, 333, anyValue);
    });
    it("Should allow seller to lower the starting price", async function () {
        await expect(house.connect(user1).lowerStartingPrice(0, 50))
        .to.emit(house, "AuctionUpdated")
        .withArgs(0, 50);
    });
    it("Should allow bidder to bid on an auction", async function () {
        await token.connect(user2).approve(house.target, 200);
        await expect(house.connect(user2).placeBid(0, 200))
        .to.emit(house, "BidPlaced")
        .withArgs(0, user2.address, 200);
    });
    it("Should not allow seller to lower the starting price once a bid has been placed", async function () {
        await expect(house.connect(user1).lowerStartingPrice(0, 20))
        .to.be.revertedWith("Bid has already been placed");
    });
    it("Should allow another bidder to bid the item", async function () {
        await token.connect(user3).approve(house.target, 300);
        await expect(house.connect(user3).placeBid(0, 300))
        .to.emit(house, "BidPlaced")
        .withArgs(0, user3.address, 300);
    });

});