const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
// const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs")

const uri1 = "ipfs://bafybeibqv73fvudnhmjvo7leuvu7oka2ig3igseawfhchtn4yg65mxdu3y";
const uri2 = "ipfs://bafybeif6qxkq3kxlm4ml5p5j6umbi2cn5yznt3yb3iaiimicvat5tqbawm";

describe("AuctionHouse contract unit test", function () {
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

// use root hooks to setup accounts and share states between tests
describe("AuctionHouse contract workflow tests", function () {
    // let owner, user1, user2, user3;
    // let token, item, house;

    // before(async function () {
    //     [owner, user1, user2, user3] = await ethers.getSigners();
    //     token = await ethers.deployContract("AuctionToken");
    //     await token.waitForDeployment();
    //     item = await ethers.deployContract("AuctionItem", [user1.address, "Test1", "TEST1"]);
    //     house = await ethers.deployContract("AuctionHouse", [token.target, owner.address]);
    // });
    
    it("Should allow user to create an auction", async function () {
        let owner, user1, user2, user3;
    let token, item, house;

    [owner, user1, user2, user3] = await ethers.getSigners();
        token = await ethers.deployContract("AuctionToken");
        await token.waitForDeployment();
        item = await ethers.deployContract("AuctionItem", [user1.address, "Test1", "TEST1"]);
        house = await ethers.deployContract("AuctionHouse", [token.target, owner.address]);



        item.connect(user1).safeMint(user1.address, uri1);
        // await item.connect(user1).setApprovalForAll(house.target, true);
        console.log("result is:");
        const result = await house.connect(user1).startAuction(0, 100, 1000);
        console.log(result);
        // await expect(house.connect(user1).startAuction(0, 100, 1000))
        // .to.emit(house, "AuctionStarted")
        // .withArgs(0, 0, 100, 100);

    });

});