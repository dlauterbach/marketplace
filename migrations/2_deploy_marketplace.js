var Ownable = artifacts.require("./Ownable.sol");
var EternalStorage = artifacts.require("./EternalStorage.sol");
var ListingsLibrary = artifacts.require("./ListingsLibrary.sol");
var MarketPlace = artifacts.require("./MarketPlace.sol");

module.exports = function(deployer) {
  deployer.deploy(Ownable);
  deployer.deploy(EternalStorage);
  deployer.deploy(ListingsLibrary).then(() => {
    return deployer.link(ListingsLibrary,MarketPlace)
  }).then(() => {
    return deployer.deploy(MarketPlace)
  })
};
