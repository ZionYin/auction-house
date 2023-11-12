// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

/// @title An auction house for NFTs using ERC-20 tokens
/// @author Zion
/// @notice You can use this contract to sell and bid on NFTs using ERC-20 tokens
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

    /// @notice Emitted when an auction is started
    /// @param auctionId The ID of the auction in auctions
    /// @param startingPrice The starting price of the auction
    /// @param endTime The timestamp when the auction will end
    event AuctionStarted(uint auctionId, uint startingPrice, uint endTime);

    /// @notice Emitted when an auction is updated
    /// @param auctionId The ID of the auction in auctions
    /// @param newStartingPrice The new starting price of the auction
    event AuctionUpdated(uint auctionId, uint newStartingPrice);

    /// @notice Emitted when an auction is cancelled
    /// @param auctionId The ID of the auction in auctions
    event AuctionCancelled(uint auctionId);

    /// @notice Emitted when an auction is ended
    /// @param auctionId The ID of the auction in auctions
    /// @param winner The address of the winner of the auction
    /// @param winningBid The amount of the winning bid
    event AuctionEnded(uint auctionId, address winner, uint winningBid);

    /// @notice Emitted when a bid is placed
    /// @param auctionId The ID of the auction in auctions
    /// @param bidder The address of the bidder
    /// @param amount The amount of the bid
    event BidPlaced(uint auctionId, address bidder, uint amount);

    /// @notice Emitted when an item is claimed
    /// @param auctionId The ID of the auction in auctions
    event ItemClaimed(uint auctionId);

    /// @notice Emitted when fees are withdrawn
    /// @param to The address of the recipient of the fees
    /// @param amount The amount of fees withdrawn
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

    /// @notice Start an auction
    /// @param itemContract The address of the ERC-721 contract
    /// @param itemId The ID of the item in the ERC-721 contract
    /// @param startingPrice The starting price of the auction
    /// @param duration The duration of the auction in seconds
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

    ///@notice Cancel an auction
    ///@param auctionId The ID of the auction in auctions
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

    ///@notice End an auction
    ///@param auctionId The ID of the auction in auctions
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

    ///@notice Lower the starting price of an auction
    ///@param auctionId The ID of the auction in auctions
    ///@param newStartingPrice The new starting price of the auction
    function lowerStartingPrice(uint auctionId, uint newStartingPrice) external auctionExists(auctionId) {
        Auction storage auction = auctions[auctionId];
        require(msg.sender == auction.seller, "You are not the seller");
        require(block.timestamp < auction.endTime, "Auction has ended");
        require(newStartingPrice < auction.currentBid, "New starting price must be lower than current bid");
        require(auction.currentBidder == address(0), "Bid has already been placed");
        
        emit AuctionUpdated(auctionId, newStartingPrice);
        auction.startingPrice = newStartingPrice;
    }

    ///@notice Place a bid on an auction
    ///@param auctionId The ID of the auction in auctions
    ///@param amount The amount of the bid
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

    ///@notice Claim an item after winning an auction
    ///@param auctionId The ID of the auction in auctions
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

    ///@notice Set the fee percentage for the auction house
    ///@param _feePercentage The fee percentage to be set
    function setFeePercentage(uint _feePercentage) external isAdminOrManager {
        require(_feePercentage <= 10000, "Invalid fee percentage");
        feePercentage = _feePercentage;
    }

    ///@notice Change the admin of the auction house
    ///@param newAdmin The address of the new admin
    function changeAdmin(address newAdmin) external isAdmin {
        admin = newAdmin;
    }

    ///@notice Get the fees collected by the auction house
    ///@return The amount of fees collected
    function getFees() external view returns (uint) {
        return auctionToken.balanceOf(address(this));
    }

    ///@notice Withdraw fees collected by the auction house
    ///@param amount The amount of fees to withdraw
    function withdrawFees(uint amount) external isAdminOrManager {
        uint fees = auctionToken.balanceOf(address(this));
        require(amount <= fees, "Amount exceeds fees");
        auctionToken.transfer(admin, amount);
        emit FeeWithdrawn(admin, amount);
    }

    ///@notice Add a manager
    ///@param manager The address of the manager to add
    function addManager(address manager) external isAdmin {
        require(!isManager(manager), "Address is already a manager");
        managers.push(manager);
    }

    ///@notice Remove a manager
    ///@param manager The address of the manager to remove
    function removeManager(address manager) external isAdmin {
        for (uint i = 0; i < managers.length; i++) {
            if (managers[i] == manager) {
                managers[i] = managers[managers.length - 1];
                managers.pop();
                break;
            }
        }
    }

    ///@notice Check if an address is a manager
    ///@param addr The address to check
    ///@return Whether the address is a manager
    function isManager(address addr) public view returns (bool) {
        for (uint i = 0; i < managers.length; i++) {
            if (managers[i] == addr) {
                return true;
            }
        }
        return false;
    }
    
}