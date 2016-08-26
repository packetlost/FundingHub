# FundingHub [GitHub Repo](https://github.com/dsystems-io/FundingHub)
Decentralized Crowd-funding platform built with Ethereum + React.

## Dependencies
* [Node.js & npm](https://nodejs.org)
* [Truffle](https://github.com/ConsenSys/truffle)
* [Geth](https://github.com/ethereum/go-ethereum/wiki/geth) or [testrpc](https://github.com/ethereumjs/testrpc)

## Notes
The specification calls for 3 functions `fund()`, `payout()`, and `refund()`. The functionality of `fund()` is such that it calls either `payout()` or `refund()` if conditions are met while processing this call. However, this requires that the contract trust the sender of the transaction and also that we implement a loop to send funds.  This opens up the contract to attacks whereby a single campaign funder could create a fallback function that throws, and thus prevents the rest of the funders from receiving a refund. It also creates a risk of Stack Depth Attacks and runs the risk of naturally reach the stack depth limit when there are many funders. Therefore this contract opts for a pull rather that push methodology. Instead of having the contract loop through the funders and send funds, we require the funders to pull out their refunds themselves by calling the contract.

## First Run
*  `npm install`
*  `truffle compile`
*  `truffle migrate`
*  `truffle serve`

## Test
* `truffle test`

## License
[MIT](https://github.com/dsystems-io/FundingHub/blob/master/LICENSE)
