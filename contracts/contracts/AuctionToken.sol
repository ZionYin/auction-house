// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

///@title An ERC20 token for auctioning ERC721 tokens
///@notice You can use this contract to create ERC20 tokens for auctioning ERC721 tokens
contract AuctionToken is ERC20 {
    constructor()
        ERC20("AuctionToken", "AUC")
    {}

    function mint(uint amount) public {
        _mint(msg.sender, amount);
    }
}
