var HDWalletProvider = require('@truffle/hdwallet-provider')

var mnemonic = 'your mnemonic'
var publicTestnetNode = 'https://public-node.testnet.rsk.co/'

const fs = require('fs');
const gasPriceTestnetRaw = fs.readFileSync(".gas-price-testnet.json").toString().trim();
const gasPriceTestnet = parseInt(JSON.parse(gasPriceTestnetRaw).result, 16);
if (typeof gasPriceTestnet !== 'number' || isNaN(gasPriceTestnet)) {
  throw new Error('unable to retrieve network gas price from .gas-price-testnet.json');
}
console.log("Gas price Testnet: " + gasPriceTestnet);

module.exports = {
  networks: {

    //DEFAULT
    development: {
     skipDryRun: true,
     host: "127.0.0.1",     // Localhost (default: none)
     port: 8545,            // Standard Ethereum port (default: none)
     network_id: "*",       // Any network (default: none)
    },

    //RSK
    development: {
      host: "127.0.0.1",
      port: 4444,
      network_id: "*"
    },
    rskTestnet: {
      provider: () => new HDWalletProvider(mnemonic, publicTestnetNode),
      network_id: 31,
      gasPrice: Math.floor(gasPriceTestnet * 1.1),
      networkCheckTimeout: 1e9
    },

    //Ethereum Rinkeby
    rinkeby: {
      host: "127.0.0.1", // Connect to geth on the specified
      port: 8545,
      from: "", // default address to use for any transaction Truffle makes during migrations
      network_id: 4,
      gas: 4612388 // Gas limit used for deploys
    }
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      // version: "0.5.1",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    }
  }
}
