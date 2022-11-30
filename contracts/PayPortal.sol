// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract PayPortal {

    constructor() payable {
        console.log("Smart Pay Contract");
    }
}
