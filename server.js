require('./services/config');
const ipfsAPI = require('ipfs-api');
const express = require('express');
const fs = require('fs');
const moment = require('moment');
const app = express();
const hsService = require('./services/hs-service');
const web3Utils = require('./services/web3-Utils');
const SHA256 = require("crypto-js/sha256");

const ipfs = ipfsAPI(CONFIG.ipfs_api_address, CONFIG.ipfs_api_port, {protocol: 'http'});

app.get('/addfile', async function(req, res) {

	if (!req.query.path){
		res.status = 400;
		res.send({msg: 'Please provide file "path" as parameter!'});	
		return;
	} 
	
	try 
	{	
		//## prepare data
		var fileContent = fs.readFileSync(req.query.path,"utf-8");
		var fileToAdd = Buffer.from(fileContent);
		var fileHash = SHA256(fileContent).toString();
		
		var epochTime = Math.round(moment().format('X'));
		console.log(moment().format('X'));
		
		//## save to ifps
		var fileIPFS = await ipfs.files.add(fileToAdd);
		console.log('Added to ipfs : ' + fileIPFS[0].hash);
		
		//## save to blockchain
		console.log('fileHash : ' + fileHash);
		const data = await hsService.add(fileIPFS[0].hash, fileHash, epochTime);
		
		console.log('Added to ETH Blockchain!');
		res.status = 200;
		res.send({tx: data, ipfsHash: fileIPFS[0].hash, fileHash: fileHash});
	} catch (err) {
		console.log(err);
		res.status = 500;
		res.send();
	}
})

app.get('/getfile', async function(req, res) {
    
	if (!req.query.hash){
		res.status = 400;
		res.send({msg: 'Please provide file path!'});
		return;
	}
	
	var hash = req.query.hash;
	try {
		//## get from blockchain
		const response = await hsService.get(hash);
		if(response[0].exists == false) {
			console.log('File hash not found in smart contract!');
			res.status = 404;
			res.send({msg: 'Not found'});
			return;
		}
		console.log('Found in ETH Blockchain: ' + web3Utils.bytesToString(response[0].filehash));
		
		var ipfsHash = web3Utils.bytesToString(response[0].ipfshash);
		//## get from ipfs
		var files = await ipfs.files.get(ipfsHash);
		files.forEach((file) => {
			console.log('Found in IPFS: ' + file.path);
		//	console.log(file.content.toString('utf8'));
		});
		
		//## prepare data to return
		let data = [];
		data.push({ 
			hash: hash,
			unixTimeAdded: response[0].dateAdded,
			exists: response[0].exists,
			url: CONFIG.ipfs_url + ipfsHash 
		});

		//## return
		console.log('File found in IPFS and ETH Blockchain!');
		res.status = 200;
		res.send(data);
	} catch (err) {
		console.log(err);
		res.status = 500;
		res.send();
	}
})

app.listen(CONFIG.port, () => console.log(`DocuHash listening on port ${CONFIG.port}`))
