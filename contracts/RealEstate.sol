//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract RealEstate is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("Real State","REAL") {}        //creating ERC721(NFt) with name = Real STate and Symbol REAL

    function mint(string memory tokenURI) public returns (uint256){
        _tokenIds.increment();                          //initially counter = 0 and get increment by 1

    uint256 newItemId = _tokenIds.current();            //returns current valuu in tokenIds counter
        _mint(msg.sender,newItemId);                    //calling _mint function from ERC721Storage with "to" address (owner) and unique ID -newItemId for token to be minted
        _setTokenURI(newItemId,tokenURI);               //calling _setTokenURI function with params - Unique ID and new URI of the token to be minted

        return newItemId;                               //returns unique ID of the newly minted token
    }

    function totalSupply() public view returns (uint256){
        return _tokenIds.current();                     //returns number of Tokens minted so far
    }
}
