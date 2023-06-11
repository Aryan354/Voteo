module.exports = {
  networks: {
    development: {
      host: "127.0.0.1", // Localhost (default: ganache-cli)
      port: 7545, // Port number of the development blockchain
      network_id: "*", // Match any network ID
    },
  },
  compilers: {
    solc: {
      version: "0.8.0", // Specify the desired version of the Solidity compiler
    },
  },
};
