// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract PayPortal {
    AggregatorV3Interface internal priceFeed;

    /**
     * Network: Mumbai
     * Aggregator: Matic/USD
     * Address: 0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada
     */

    constructor() payable {
        priceFeed = AggregatorV3Interface(
            0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada
        );

        console.log("Yo! Smart Contract");

        // user who is calling this function address
        owner = payable(msg.sender);
    
    }

    /**
     * Returns the latest price
     */
    function getLatestPrice() public view returns (int) {
        (
            ,
            /*uint80 roundID*/ int price /*uint startedAt*/ /*uint timeStamp*/ /*uint80 answeredInRound*/,
            ,
            ,

        ) = priceFeed.latestRoundData();
        return price;
    }

    int public storedPrice;
    
    function storeLatestPrice() external {
        storedPrice = getLatestPrice();
    }

    uint256 totalPay;

    address payable public owner; 

    /*
     * A little magic, Google what events are in Solidity!
     */
    event NewPay(
        address indexed from,
        uint256 timestamp,
        string message,
        string name
    );

    /*
     * I created a struct here named Pay.
     * A struct is basically a custom datatype where we can customize what we want to hold inside it.
     */
    struct Pay {
        address giver; // The address of the user who buys an item.
        string message; // The description of the item bought.
        string name; // The title of the item bought.
        uint256 timestamp; // The timestamp when the item is bought.
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
        // Optional: Add this line if you want to see the contract print the value!
        // We'll also print it over in run.js as well.
        console.log("We have %d total pay recieved ", totalPay);
        return totalPay;
    }

    /*
     * You'll notice I changed the buyPay function a little here as well and
     * now it requires a string called _message. This is the message our user
     * sends us from the front end!
     */
    function buyPay(
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
        pay.push(Pay(msg.sender, _message, _name, block.timestamp));

        (bool success, ) = owner.call{value: _payAmount}("");
        require(success, "Failed to send money");

        emit NewPay(msg.sender, block.timestamp, _message, _name);
    }
}