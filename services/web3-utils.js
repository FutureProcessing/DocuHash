const web3 = require('./web3-provider');

module.exports = {
    
    hashString: (data) => {
        if(typeof data !== 'string') {
            throw new Error(`expecting argument of type string, but got: ${typeof data}`);
        }

        return web3.utils.soliditySha3(data); 
    },

    stringToBytes: (data) => {
        if(typeof data !== 'string') {
            throw new Error(`expecting argument of type string, but got: ${typeof data}`);
        }

        return web3.utils.asciiToHex(data);
    },

    bytesToString: (bytes) => {
        return web3.utils.hexToUtf8(bytes);
    },

    numberInEtherToWei: (data) => {
        return web3.utils.toWei(data, 'ether');
    }
};