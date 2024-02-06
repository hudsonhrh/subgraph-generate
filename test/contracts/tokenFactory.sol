// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./token.sol"; 

contract TokenFactory {
    event TokenCreated(address indexed tokenAddress, string name, string symbol, uint256 initialSupply, address owner);

    function createToken(string memory name, string memory symbol, uint256 initialSupply) public {
        Token newToken = new Token();
        newToken.initialize(name, symbol, initialSupply, msg.sender); // Initialize the new token
        emit TokenCreated(address(newToken), name, symbol, initialSupply, msg.sender);
    }
}
