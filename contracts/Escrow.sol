//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.20;

interface IERC721 {
    function transferFrom(
        address _from,
        address _to,
        uint256 _id
    ) external;
}

contract Escrow {

    address public nftContractAddress;
    address payable public seller;
    address public inspector;
    address public lender;

    modifier onlySeller(){
        require(msg.sender == seller,"Only Seller can call this method");
        _;
    }

    mapping (uint256 => bool) public isListed;
    mapping (uint256 => uint256) public purchasePrice;
    mapping (uint256 => uint256) public escrowAmount;
    mapping (uint256 => address) public buyer;

    constructor(
        address _nftContractAddress,
        address payable _seller,
        address _inspector,
        address _lender
    ){
        nftContractAddress = _nftContractAddress;
        seller = _seller;
        inspector = _inspector;
        lender = _lender;
    }

    function list(
        uint256 _nftID,
        address _buyer,
        uint256 _purchasePrice,
        uint256 _escrowAmount) public payable onlySeller{
            
        //transfer the NFT from seller to this contract
        IERC721(nftContractAddress).transferFrom(msg.sender, address(this), _nftID); 
        
        isListed[_nftID] = true;                 //Adding the NFT in Listed mapping 
        purchasePrice[_nftID] = _purchasePrice;
        escrowAmount[_nftID] = _escrowAmount;
        buyer[_nftID] = _buyer;
    }
}
