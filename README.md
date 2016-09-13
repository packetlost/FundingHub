# FundingHub [GitHub Repo](https://github.com/dsystems-io/FundingHub)
Decentralized Crowd-funding platform built with Ethereum + React.

## Dependencies
* [Node.js & npm](https://nodejs.org)
* [Truffle](https://github.com/ConsenSys/truffle)
* [Geth](https://github.com/ethereum/go-ethereum/wiki/geth) or [testrpc](https://github.com/ethereumjs/testrpc)
* [Webpack](https://webpack.github.io/) installed globally

## Notes
1. The specification calls for 3 functions `fund()`, `payout()`, and `refund()`. The functionality of `fund()` is such that it calls either `payout()` or `refund()` if conditions are met while processing this call. However, this requires that the contract trust the sender of the transaction and also that we implement a loop to send funds.  This opens up the contract to attacks whereby a single funder could create a fallback function that throws, and thus prevents the rest of the funders from receiving a refund. It also creates a risk of Stack Depth Attacks and runs the risk of naturally reaching the stack depth limit when there are too many funders

  Therefore, this contract uses a pull rather that push methodology as suggested [here](https://blog.ethereum.org/2016/06/10/smart-contract-security/). Instead of having the contract loop through the funders to send funds, we require the funders to pull refunds themselves by calling the `refund()` function. The same is true for `payout()`. The UX reflects this by allowing funders & project owners to take actions on finished projects.

2. Having issues when running tests in truffle. Unable to resolve the error message:  "The contract code couldn't be stored, please check your gas amount.".

## First Run
*  `npm install`
*  `npm install webpack -g` (If not already installed)
*  `truffle compile`
*  `truffle migrate`
*  `truffle serve`

## Testing
* `truffle test`

## License
[MIT](https://github.com/dsystems-io/FundingHub/blob/master/LICENSE)
