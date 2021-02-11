# the-multi-blockchain-docker
  
  - Ethermint node
  - Ethereum Rinkeby
  - RSK node
  - Moonbeam
  - Namecoin
  - Doichain

## Installation

1. Install Docker and Docker Compose
2. Run ```npm install``` to install the dependencies
3. ```cd``` to one of the blockchains folder and run 
```docker-compose up -d``` to start the node

4. Back in the root folder, deploy the smart contract to each blockchain using:

```
truffle migrate --network ethermint #for ethermint
truffle migrate --network rsk #for rsk
truffle migrate --network moonbeam #for moonbeam (polkadot)
```
Make sure to enable the correct configuration in ```truffle-config.js```


5. Documentations
- MoonBeam 
    - Interacting with Moonbeam using Truffle https://docs.moonbeam.network/getting-started/local-node/using-truffle/