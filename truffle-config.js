var HDWalletProvider = require('@truffle/hdwallet-provider')
const PrivateKeyProvider = require('./private-provider');

// Moonbeam Standalone Development Node Private Key
const privateKeyDev =
   '99B3C12287537E38C90A9219D4CB074A89A16E9CDB20BF85728EBD97C343E342';
// Moonbase Alpha Private Key --> Please change this to your own Private Key with funds
const privateKeyMoonbase =
   '';

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

    ethermint: {
     skipDryRun: true,
     host: "127.0.0.1",     // Localhost (default: none)
     port: 8545,            // Standard Ethereum port (default: none)
     network_id: "1",       // Any network (default: none)
     gasPrice: Math.floor(gasPriceTestnet * 1.1),
    },

    rsk: {
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

    rinkeby: {
      host: "127.0.0.1", // Connect to geth on the specified
      port: 8545,
      from: "", // default address to use for any transaction Truffle makes during migrations
      network_id: 4,
      gas: 4612388 // Gas limit used for deploys
    },

    moonbeam: {
      provider: () => {
         if (!privateKeyDev.trim()) {
            throw new Error('Please enter a private key with funds, you can use the default one');
         }
         return new PrivateKeyProvider(privateKeyDev, 'http://localhost:9933/', 1281)
      },
      network_id: 1281,
    },
     // Moonbase Alpha TestNet
    moonbase: {
      provider: () => {
         if (!privateKeyMoonbase.trim()) {
            throw new Error('Please enter a private key with funds to send transactions to TestNet');
         }
         if (privateKeyDev == privateKeyMoonbase) {
            throw new Error('Please change the private key used for Moonbase to your own with funds');
         }
         return new PrivateKeyProvider(privateKeyMoonbase, 'https://rpc.testnet.moonbeam.network', 1287)
      },
      network_id: 1287,
    },
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
