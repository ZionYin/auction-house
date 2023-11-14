import token from './abi/AuctionToken.sol/AuctionToken.json'
import item from './abi/AuctionItem.sol/AuctionItem.json'
import house from './abi/AuctionHouse.sol/AuctionHouse.json'

export const tokenAddress = '0xC300eF49E8047E76F2a1095A3201896735Ce6c52'
export const houseAddress = '0xf20e9ed7b439FA97FC6313D3A86c95AebDC4D6Fd'
export const tokenABI = token.abi
export const itemABI = item.abi
export const houseABI = house.abi
export const itemBytecode = item.bytecode
