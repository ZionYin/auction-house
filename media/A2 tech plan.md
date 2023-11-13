| Variables     |                          |                                                          |
| ------------- | ------------------------ | -------------------------------------------------------- |
| admin         | address                  | address of the auction house admin                       |
| managers      | address[]                | array of addresses of the auction house manager          |
| auctionToken  | IERC20                   | IERC20 Interface of the custom token used in the auction |
| feePercentage | uint                     | the percentage of fees being charged by the house        |
| auctions      | mapping(unit => Auction) | a mapping from auctionId to the auction struct           |

| Auction struct |         |                                                          |
| -------------- | ------- | -------------------------------------------------------- |
| seller         | address | the address of the seller                                |
| itemContract   | address | the ERC721 contract address for the item being auctioned |
| itemId         | uint    | the idemId in the ERC21 contract for the item            |
| startingPrice  | uint    | the starting price of the item                           |
| endTime        | uint    | the ending time of the auction                           |
| currentBid     | uint    | the current highest bid of the auction                   |
| currentBidder  | address | the highest bidder in the auction                        |

| Functions    |                                                                          |                                              |
| ------------ | ------------------------------------------------------------------------ | -------------------------------------------- |
| constructor  | (\_auctionToken: address, initialAdmin: address)                         | set the admin and the accepted token address |
| startAuction | itemContract: address, itemId: uint, startingPrice: uint, duration: uint | start the auction                            |
| cancelAuction| auctionId: uint                                                           | cancel the auction                           |
| endAuction   | auctionId: uint                                                           | end the auction                              |\
| lowerStartingPrice | auctionId: uint, newStartingPrice: uint | lower the starting price of the auction |
| placeBid     | auctionId: uint, amount: uint | place a bid in the auction |
| claimItem    | auctionId: uint | claim the item after the auction is ended |
| setFeePercentage | newFeePercentage: uint | set the fee percentage of the auction house |
| changeAdmin  | newAdmin: address | change the admin of the auction house |
| getFees | | get the total amount of fees collected by the auction house |
| withdrawFees | amount: uint | withdraw the fees specified in amount collected by the auction house |
| addManager | manager: address | add a manager to the auction house |
| removeManager | manager: address | remove a manager from the auction house |
| isManager | manager: address | check if the address is a manager of the auction house |

| Events | | |
| ------ | ------- | -------------------------------------------------------- |
| AuctionStarted | auctionId: uint, startingPrice: uint, endTime: uint | emitted when an auction is started |
| AuctionUodated | auctionId: uint, newStartingPrice: uint | emitted when the starting price of an auction is lowered |
| AuctionCancelled | auctionId: uint | emitted when an auction is cancelled |
| AuctionEnded | auctionId: uint, winner: address, winningBid: uint | emitted when an auction is ended |
| BidPlaced | auctionId: uint, bidder: address, amount: uint | emitted when a bid is placed |
| ItemClaimed | auctionId: uint| emitted when the item is claimed |
| FeeWithdrawn | to: address, amount: uint | emitted when the fees are withdrawn |
