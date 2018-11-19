require('./config');
const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');

const provider = new HDWalletProvider(
    CONFIG.wallet_passphrase,
    CONFIG.eth_url
);

const web3 = new Web3(provider);

module.exports = web3;