require('dotenv').config()
const Web3 = require('web3');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const mnemonic = process.env.MNEMONIC;
const clientURL = `https://rpc-mumbai.maticvigil.com`;
const provider = new HDWalletProvider(mnemonic,clientURL);
const web3 = new Web3(provider); 

const data = require('../build/contracts/mintContract.json');
const abiArray = data.abi;
const contract_address ="0x795a071bE1D8747Ce8D69686Ab4272dAdb209097";
const address = [ "https://ipfs.io/ipfs/QmNmi6zLEJBAhy2uKPHNkhpnw7E94wV2uhvi8tNKEJF3cF",
 "https://ipfs.io/ipfs/QmScqjjEhRTn27jMrnRpwKRkZ8uRmQVkig9JA7ys8BwKA2",
 "https://ipfs.io/ipfs/QmTi1v6kbavZSnva5xPXUmBRKZz6iPQvjPg7jHWhyweiRy",
 "https://ipfs.io/ipfs/QmZAxZK4QZf5L2MMx1MugTZYaYRVbvPK4iw734Jyvxhpv1",
 "https://ipfs.io/ipfs/QmPJ48MSSg5KhRqhE5xwy8WoMD4ZWdZJH1BXubrjoqhrSQ",
 "https://ipfs.io/ipfs/QmcYGKJtsvtYCiX2zxe67oLmnWfMXD4hX8gHLr4jhrCEPb",
 "https://ipfs.io/ipfs/QmesgJ7JE4jo2a4zZg3nZbTYXkCADSHuE9vzmi7sDWWNXL",
 "https://ipfs.io/ipfs/QmVeuJ5UdUiXv3AtvhG5N6vVAbQXFc1d6yVTfmnE6RDQBb",
 "https://ipfs.io/ipfs/QmUThUxpr9WGpjd96Xq1z9Br5jHSRXpP8H5BSfVPsWGgR6",
 "https://ipfs.io/ipfs/QmccW6EtVAmhFc3S9gcjmBs2YAkoHnTvX6QWp5iFndN8HK"];
const deploy = async() =>{
    const accounts = await web3.eth.getAccounts();
    
    const contract = await new web3.eth.Contract(abiArray,contract_address);
    for (let i = 0; i < accounts.length; i++){
    const tokenURI = address[i]
    await contract.methods.mintNFT(tokenURI).send({from: "0xE8EF271C20688805D4bA7aE770d1B58281f6084d"});
}
  
}

deploy();