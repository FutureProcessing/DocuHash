const result = require('dotenv').config();

CONFIG = {} 
CONFIG.app = process.env.APP   || 'development';
CONFIG.port = process.env.PORT  || '3002';

CONFIG.eth_url = process.env.ETH_URL || 'http://127.0.0.1:9545';
CONFIG.wallet_passphrase = process.env.HD_WALLET_PASSPHRASE || 'exact cabbage shove public maximum erase remain around crawl major april cross';
CONFIG.eth_network_id = process.env.ETH_NETWORK_ID || '5777';

CONFIG.hs_contract_address = "0x4bf7b71E58204a14C55E6Fe068942bFD91AbF102";

CONFIG.ipfs_api_address = '127.0.0.1';
CONFIG.ipfs_api_port = '5001';
CONFIG.ipfs_url = CONFIG.ipfs_api_address + ':8080/ipfs/';


