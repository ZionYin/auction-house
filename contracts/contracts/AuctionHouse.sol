// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract AuctionHouse {

    uint private _nextAuctionId;

    struct Auction {
        address seller;
        address itemContract;
        uint itemId;
        uint startingPrice;
        uint endTime;
        uint currentBid;
        address currentBidder;
    }

    IERC20 public auctionToken;
    uint public feePercentage = 250;
    address public admin;
    address[] public managers;

    mapping(uint => Auction) public auctions;

    event AuctionStarted(uint auctionId, uint startingPrice, uint endTime);
    event AuctionUpdated(uint auctionId, uint newStartingPrice);
    event AuctionCancelled(uint auctionId);
    event AuctionEnded(uint auctionId, address winner, uint winningBid);
    event BidPlaced(uint auctionId, address bidder, uint amount);
    event ItemClaimed(uint auctionId);
    event FeeWithdrawn(address to, uint amount);

    constructor(address _auctionToken, address initialAdmin) {
        auctionToken = IERC20(_auctionToken);
        admin = initialAdmin;
    }

    modifier isAdmin() {
        require(msg.sender == admin, "Not an admin");
        _;
    }

    modifier isAdminOrManager() {
        require(msg.sender == admin || isManager(msg.sender), "Not an admin or manager");
        _;
    }

    modifier auctionExists(uint auctionId) {
        require(auctions[auctionId].seller != address(0), "Auction does not exist");
        _;
    }

    modifier auctionNotEnded(uint auctionId) {
        require(block.timestamp < auctions[auctionId].endTime, "Auction has ended");
        _;
    }

    function startAuction(address itemContract, uint itemId, uint startingPrice, uint duration) external {
        IERC721 auctionItem = IERC721(itemContract);
        require(tx.origin == auctionItem.ownerOf(itemId), "You don't own the item");
        require(startingPrice > 0, "Starting price must be greater than 0");

        auctionItem.transferFrom(tx.origin, address(this), itemId);
        
        uint auctionId = _nextAuctionId++;
        uint endTime = block.timestamp + duration;
        
        auctions[auctionId] = Auction({
            seller: tx.origin,
            itemContract: itemContract,
            itemId: itemId,
            startingPrice: startingPrice,
            endTime: endTime,
            currentBid: startingPrice,
            currentBidder: address(0)
        });
        
        
        emit AuctionStarted(auctionId, startingPrice, endTime);
    }

    function cancelAuction(uint auctionId) external auctionExists(auctionId) {
        Auction storage auction = auctions[auctionId];
        require(msg.sender == auction.seller, "You are not the seller");
        require(block.timestamp < auction.endTime, "Auction has ended");
        
        IERC721 auctionItem = IERC721(auction.itemContract);
        auctionItem.transferFrom(address(this), auction.seller, auction.itemId);
        if (auction.currentBidder != address(0)) {
            auctionToken.transfer(auction.currentBidder, auction.currentBid);    
        }
        emit AuctionCancelled(auctionId);
        delete auctions[auctionId];
    }

    function endAuction(uint auctionId) external auctionExists(auctionId) {
        Auction storage auction = auctions[auctionId];
        require(msg.sender == auction.seller, "You are not the seller");
        
        address winner = auction.currentBidder;
        uint winningBid = auction.currentBid;
        uint fee = (winningBid * feePercentage) / 10000;
        uint sellerProceeds = winningBid - fee;
        
        IERC721 auctionItem = IERC721(auction.itemContract);
        auctionItem.transferFrom(address(this), winner, auction.itemId);
        auctionToken.transfer(auction.seller, sellerProceeds);
        
        emit AuctionEnded(auctionId, winner, winningBid);
        delete auctions[auctionId];
    }

    function lowerStartingPrice(uint auctionId, uint newStartingPrice) external auctionExists(auctionId) {
        Auction storage auction = auctions[auctionId];
        require(msg.sender == auction.seller, "You are not the seller");
        require(block.timestamp < auction.endTime, "Auction has ended");
        require(newStartingPrice < auction.currentBid, "New starting price must be lower than current bid");
        require(auction.currentBidder == address(0), "Bid has already been placed");
        
        emit AuctionUpdated(auctionId, newStartingPrice);
        auction.startingPrice = newStartingPrice;
    }

    function placeBid(uint auctionId, uint amount) external auctionExists(auctionId) auctionNotEnded(auctionId) {
        Auction storage auction = auctions[auctionId];
        require(amount > auction.currentBid, "Bid must be higher than the current bid");
        require(msg.sender != auction.currentBidder, "You already have the highest bid");
        
        auctionToken.transferFrom(msg.sender, address(this), amount);
        if (auction.currentBidder != address(0)) {
            // Refund the previous bidder
            auctionToken.transfer(auction.currentBidder, auction.currentBid);
        }
        auction.currentBid = amount;
        auction.currentBidder = msg.sender;
        emit BidPlaced(auctionId, msg.sender, amount);
    }

    function claimItem(uint auctionId) external auctionExists(auctionId) {
        Auction storage auction = auctions[auctionId];
        require(block.timestamp >= auction.endTime, "Auction has not ended yet");
        require(msg.sender == auction.currentBidder, "You are not the highest bidder");
        
        IERC721 auctionItem = IERC721(auction.itemContract);
        uint fee = (auction.currentBid * feePercentage) / 10000;
        uint sellerProceeds = auction.currentBid - fee;
        auctionItem.transferFrom(address(this), msg.sender, auction.itemId);
        auctionToken.transfer(auction.seller, sellerProceeds);
        emit ItemClaimed(auctionId);
        delete auctions[auctionId];
    }

    function setFeePercentage(uint _feePercentage) external isAdminOrManager {
        require(_feePercentage <= 10000, "Invalid fee percentage");
        feePercentage = _feePercentage;
    }

    function changeAdmin(address newAdmin) external isAdmin {
        admin = newAdmin;
    }

    function withdrawFees() external isAdminOrManager {
        uint fees = auctionToken.balanceOf(address(this));
        auctionToken.transfer(admin, fees);
        emit FeeWithdrawn(admin, fees);
    }

    function addManager(address manager) external isAdmin {
        require(!isManager(manager), "Address is already a manager");
        managers.push(manager);
    }

    function removeManager(address manager) external isAdmin {
        for (uint i = 0; i < managers.length; i++) {
            if (managers[i] == manager) {
                managers[i] = managers[managers.length - 1];
                managers.pop();
                break;
            }
        }
    }

    function isManager(address addr) public view returns (bool) {
        for (uint i = 0; i < managers.length; i++) {
            if (managers[i] == addr) {
                return true;
            }
        }
        return false;
    }
    
}