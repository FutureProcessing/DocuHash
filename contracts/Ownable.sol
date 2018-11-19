pragma solidity ^0.4.25;

contract Ownable {
    address public owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    mapping(address => bool) admins;

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(isOwner(),"Access Denied");
        _;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0),"Invalid new address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    function isOwner() public view returns (bool) {
        return msg.sender == owner ;
    }
}
