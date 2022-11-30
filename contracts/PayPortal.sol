// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract PayPortal {
    uint256 totalPay;

    address payable public owner; 

    event NewPay(
        address indexed from,
        uint256 timestamp,
        string description,
        string title
    );

    constructor() payable {
        console.log("Smart Pay Contract");

        // user who is calling this function address
        owner = payable(msg.sender);
    }

    /*
     * I created a struct here named Pay.
     * A struct is basically a custom datatype where we can customize what we want to hold inside it.
     */
    struct Pay {
        address giver; // The address of the user who pays.
        string description; // The description of the item bought.
        string title; // The title of the item bought.
        uint256 timestamp; // The timestamp when the user buys an item.
    }

    /*
     * I declare variable pay that lets me store an array of structs.
     * This is what lets me hold all the payments ever received from the store!
     */
    Pay[] pay;

    /*
     * I added a function getAllPay which will return the struct array, pay, to us.
     * This will make it easy to retrieve the payments from our website!
     */
    function getAllPay() public view returns (Pay[] memory) {
        return pay;
    }

    // Get All pay bought
    function getTotalPay() public view returns (uint256) {
        console.log("We have %d total payments recieved ", totalPay);
        return totalPay;
    }


    function buyItem(
        string memory _description,
        string memory _title,
        uint256 _payAmount
    ) public payable {
        uint256 cost = 0.001 ether;
        require(_payAmount <= cost, "Insufficient Ether provided");

        totalPay += 1;
        console.log("%s has just sent payment!", msg.sender);

        /*
         * This is where I actually store the payments data in the array.
         */
        pay.push(Pay(msg.sender, _description, _title, block.timestamp));

        (bool success, ) = owner.call{value: _payAmount}("");
        require(success, "Failed to send money");

        emit NewPay(msg.sender, block.timestamp, _description, _title);
    }
}