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
        it("Should not allow fee to be higher than 100%", async function () {
            const { house, owner } = await loadFixture(deployFixture);
            await expect(house.setFeePercentage(20000))
            .to.be.revertedWith("Invalid fee percentage");
        });
    });

    describe("AuctionHouse admin tests", function () {   
        it("Should allow admin to add managers", async function () {
            const { house, owner, user1, user2, user3 } = await loadFixture(deployFixture);
            await house.addManager(user1.address);
            await house.addManager(user2.address);
            expect(await house.isManager(user1.address)).to.equal(true);
            expect(await house.isManager(user2.address)).to.equal(true);
            expect(await house.isManager(user3.address)).to.equal(false);
        });
        it("Should not allow non-admin to add manager", async function () {
            const { house, owner, user1, user2 } = await loadFixture(deployFixture);
            await expect(house.connect(user1).addManager(user2.address))
            .to.be.revertedWith("Not an admin");
        });
        it("Should allow admin to remove manager", async function () {
            const { house, owner, user1, user2 } = await loadFixture(deployFixture);
            await house.addManager(user1.address);
            await house.addManager(user2.address);
            await house.removeManager(user2.address);
            expect(await house.isManager(user1.address)).to.equal(true);
            expect(await house.isManager(user2.address)).to.equal(false);
        });
        it("Should not allow admin to add manager twice", async function () {
            const { house, owner, user1, user2 } = await loadFixture(deployFixture);
            await house.addManager(user1.address);
            await expect(house.addManager(user1.address))
            .to.be.revertedWith("Address is already a manager");
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
        it("Should not allow non-admin to change admin", async function () {
            const { house, owner, user1, user2 } = await loadFixture(deployFixture);
            await expect(house.connect(user1).changeAdmin(user2.address))
            .to.be.revertedWith("Not an admin");
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
        // token.connect(owner).mint(1000);
        token.connect(user1).mint(1000);
        token.connect(user2).mint(1000);
        token.connect(user3).mint(1000);
    });
    
    it("Should allow user to create auctions", async function () {
        await item.connect(user1).safeMint(user1.address, uri1);
        await item.connect(user1).safeMint(user1.address, uri2);
        await item.connect(user1).safeMint(user1.address, uri3);
        await item.connect(user1).setApprovalForAll(house.target, true);
        await expect(house.connect(user1).startAuction(item.target, 0, 111, 20))
        .to.emit(house, "AuctionStarted")
        .withArgs(0, 111, anyValue);
        await expect(house.connect(user1).startAuction(item.target, 1, 222, 20))
        .to.emit(house, "AuctionStarted")
        .withArgs(1, 222, anyValue);
        await expect(house.connect(user1).startAuction(item.target, 2, 333, 20))
        .to.emit(house, "AuctionStarted")
        .withArgs(2, 333, anyValue);
    });
    it("Should show the correct auction details", async function () {
        const results = await house.getAuctions();
        expect(results.length).to.equal(3);
        expect(results[0][2]).to.equal(0);
        expect(results[0][3]).to.equal(111);
        expect(results[0][5]).to.equal(111);
        expect(results[0][6]).to.equal("0x0000000000000000000000000000000000000000");
    });
    it("Should not allow user to bid with a lower amount", async function () {
        await token.connect(user2).approve(house.target, 100);
        await expect(house.connect(user2).placeBid(0, 100))
        .to.be.revertedWith("Bid must be higher than the current bid");
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
    it("Should not allow highest bidder to bid again", async function () {
        await token.connect(user2).approve(house.target, 300);
        await expect(house.connect(user2).placeBid(0, 300))
        .to.be.revertedWith("You already have the highest bid");
    });
    it("Should not allow seller to lower the starting price once a bid has been placed", async function () {
        await expect(house.connect(user1).lowerStartingPrice(0, 20))
        .to.be.revertedWith("Bid has already been placed");
    });
    it("Should allow another bidder to bid the item", async function () {
        await token.connect(user3).approve(house.target, 1000);
        await expect(house.connect(user3).placeBid(0, 1000))
        .to.emit(house, "BidPlaced")
        .withArgs(0, user3.address, 1000);
    });
    it("Should refund the previous bidder", async function () {
        expect(await token.balanceOf(user2.address)).to.equal(1000);
    });
    it("Should allow seller to end the auction", async function () {
        await expect(house.connect(user1).endAuction(0))
        .to.emit(house, "AuctionEnded")
        .withArgs(0, user3.address, 1000);
    });
    it("Should transfer the item to the winner", async function () {
        expect(await item.ownerOf(0)).to.equal(user3.address);
    });
    it("Should transfer the seller proceeds to the seller", async function () {
        expect(await token.balanceOf(user1.address)).to.equal(1975);
    });
    it("Should allow seller to cancel an auction", async function () {
        await token.connect(user2).approve(house.target, 232);
        await house.connect(user2).placeBid(1, 232);
        await expect(house.connect(user1).cancelAuction(1))
        .to.emit(house, "AuctionCancelled")
        .withArgs(1);
    });
    it("Should refund the highest bidder", async function () {
        expect(await token.balanceOf(user2.address)).to.equal(1000);
    });
    it("Should return cancelled item to the seller", async function () {
        expect(await item.ownerOf(1)).to.equal(user1.address);
    });
    it("Should not allow bidder to claim the item before the auctio ends", async function () {
        await token.connect(user2).approve(house.target, 400);
        await house.connect(user2).placeBid(2, 400)
        await expect(house.connect(user3).claimItem(2))
        .to.be.revertedWith("Auction has not ended yet");
        
    });
    it("Should allow bidder to claim the item once the auctio ends", async function () {
        // sleep for 5 seconds
        await new Promise(resolve => setTimeout(resolve, 5000));
        await expect(house.connect(user2).claimItem(2))
        .to.emit(house, "ItemClaimed")
        .withArgs(2);
    });
    it("Should transfer the item to the winner", async function () {
        expect(await item.ownerOf(2)).to.equal(user2.address);
    });
    it("Should show the correct auction house fees balance", async function () {
        expect(await house.getFees()).to.equal(35);
    });
    it("admin should be able to withdraw fees", async function () {
        await expect(house.connect(owner).withdrawFees(20))
        .to.emit(house, "FeeWithdrawn")
        .withArgs(owner.address, 20);
        expect(await token.balanceOf(owner.address)).to.equal(20);
    });
    it("manager should be able to withdraw fees", async function () {
        await house.addManager(user1.address);
        await expect(house.connect(user1).withdrawFees(5))
        .to.emit(house, "FeeWithdrawn")
        .withArgs(owner.address, 5);
        expect(await token.balanceOf(owner.address)).to.equal(25);
    });
    it("Should not allow fee withdrawal if not enough fees", async function () {
        await expect(house.connect(owner).withdrawFees(100))
        .to.be.revertedWith("Amount exceeds fees");
    });
    it("Should not allow non-admin to withdraw fees", async function () {
        await expect(house.connect(user2).withdrawFees(100))
        .to.be.revertedWith("Not an admin or manager");
    });
});