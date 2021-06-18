var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var HashStorage = artifacts.require("./HashStorage.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(HashStorage);
};
