const path = require("path");
require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      host: "127.0.0.1",
      port: 8545,
      network_id: '*',
      websockets: true
    },
    test: {
      host: "127.0.0.1",
      port: 8545,
      network_id: '*',
      websockets: true,
    },
    rinkeby: {
      provider: () => new HDWalletProvider(process.env.MNEMONIC, `https://rinkeby.infura.io/v3/${process.env.PROJECT_ID}`),
      network_id: '4',
      skipDryRun: true,
      gasPrice: 21000000000
    }
  },
  compilers: {
    solc: {
      version: "^0.8.0"
    }
  }
};
