pragma solidity ^0.8.0;

import '../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract Dai is ERC20 {
    constructor() ERC20('Dai Stablecoin', 'Dai') public {}

    function faucet(address to, uint amount) public {
        _mint(to, amount);
    }
}