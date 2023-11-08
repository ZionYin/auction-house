// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

///@title An ERC20 token for auctioning ERC721 tokens
///@author Zion
///@notice You can use this contract to create ERC20 tokens for auctioning ERC721 tokens
contract AuctionToken is ERC20 {
    constructor()
        ERC20("AuctionToken", "AUC")
    {}

    ///@notice For simplicity, we mint tokens to the caller
    ///@param amount The amount of tokens to mint
    function mint(uint amount) public {
        _mint(msg.sender, amount);
    }
}
