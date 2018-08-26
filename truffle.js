/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a 
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() { 
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>') 
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */

require('babel-register');
require('babel-polyfill');

var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "bachelor rose illness fire flip slight goddess kick loud romance design bag";

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port:8545,
      network_id: "*", // Match any network id
      gas: 6712388,
      gasPrice: 10000000000
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(mnemonic,"https://rinkeby.infura.io/v3/db60c273909e44d9bfbb615fb34af96f");
      },
      network_id: 1,
      gas: 6900000,
      gasPrice: 100000000000
    }
  }
};
