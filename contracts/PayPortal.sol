// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "hardhat/console.sol";

contract PayPortal {
    uint256 totalPay;
    address payable public owner; 

    constructor() {
        // user who is calling this function address
        owner = payable(msg.sender);
    }

    event NewPay(
        address indexed from,
        uint256 timestamp,
        string message,
        string name,
        uint256 _payAmount
    );

    /*
     * I created a struct named Pay.
     * A struct is basically a custom datatype where we can customize what we want to hold inside it.
     */
    struct Pay {
        address giver; // The address of the user who buys an item.
        string message; // The description of the item bought.
        string name; // The title of the item bought.
        uint256 timestamp; // The timestamp when the item is bought.
        uint256 _payAmount; // The amount of funds
    }

    /*
     * I declare variable pay that lets me store an array of structs.
     * This is what lets me hold all the payments anyone ever sends to me!
     */
    Pay[] pay;

    /*
     * I added a function getAllPay which will return the struct array, pay, to us.
     * This will make it easy to retrieve the pay from our website!
     */
    function getAllPay() public view returns (Pay[] memory) {
        return pay;
    }

    // Get All payments
    function getTotalPay() public view returns (uint256) {
        console.log("We have %d total pay recieved ", totalPay);
        return totalPay;
    }

    /*
     * Execute Initialize payment
     */
    function makePayment(
        string memory _message,
        string memory _name,
        uint256 _payAmount
    ) public payable {
        uint256 cost = 0.001 ether;
        require(_payAmount <= cost, "Insufficient Ether provided");

        totalPay += 1;
        console.log("%s has just sent a payment!", msg.sender);

        /*
         * This is where I actually store the payment data in the array.
         */
        pay.push(Pay(msg.sender, _message, _name, block.timestamp, _payAmount));

        (bool success, ) = owner.call{value: _payAmount}("");
        require(success, "Failed to send money");

        emit NewPay(msg.sender, block.timestamp, _message, _name, _payAmount);
    }
}