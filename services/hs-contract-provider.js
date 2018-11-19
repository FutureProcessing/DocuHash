const web3 = require('./web3-provider');
const contract = require('./../build/contracts/HashStorage.json');
contract.numberFormat = 'String';
require('./config');

const contractInstance = new web3.eth.Contract(
    contract.abi,
    CONFIG.hs_contract_address
);

module.exports.getInstance = () => contractInstance;