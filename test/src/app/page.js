'use client'

import styles from "./page.module.css";

// Import Web3
import Web3 from 'web3';

// Import contract ABI
import tokenABI from "../abi/Token.json";
import tokenFactoryABI from "../abi/TokenFactory.json";

// Initialize Web3 and get a provider from MetaMask
const web3 = new Web3(window.ethereum);

// Get signer (account) from MetaMask
async function getAccount() {
  await window.ethereum.enable();
  const accounts = await web3.eth.getAccounts();
  return accounts[0]; // Assuming the first account is the signer
}

// Get contract instance
function getContract(account) {
  const contractAddress = "0x00058B61bcaa7731082E6C90E7317303eA1b74c9";
  const contract = new web3.eth.Contract(tokenABI.abi, contractAddress, {
    from: account // specifying the default account to use
  });
  return contract;
}

// Get balance
async function getBalance() {
  const account = await getAccount();
  const contract = getContract(account);
  const balance = await contract.methods.balanceOf(account).call();
  console.log(`Balance: ${balance}`);
  return balance;
}

// Transfer tokens
async function transferTokens() {
  const account = await getAccount();
  const contract = getContract(account);
  const tx = await contract.methods.transfer("0x00058B61bcaa7731082E6C90E7317303eA1b74c9", 100).send({
    from: account
  });
  console.log("Transaction: ", tx);
}

// Deploy contract (assuming you have the bytecode)
async function deployContract() {
  const account = await getAccount();
  const contract = new web3.eth.Contract(tokenABI.abi);
  const contractInstance = await contract.deploy({
    data: tokenABI.bytecode, 
    arguments: [1000000],
  }).send({
    from: account,
    gas: 1500000,
    gasPrice: '30000000000',
  });

  console.log("Contract deployed to:", contractInstance.options.address);
  return contractInstance;
}

// Deploy TokenFactory contract
async function deployTokenFactory() {
  const account = await getAccount();
  const contract = new web3.eth.Contract(tokenFactoryABI.abi);
  const contractInstance = await contract.deploy({
    data: tokenFactoryABI.bytecode,
  }).send({
    from: account,
  });

  console.log("TokenFactory deployed to:", contractInstance.options.address);
  return contractInstance;
}

// Assume this is the address of your deployed TokenFactory
const factoryContractAddress = "0xcCAA37CcF4f794cfcAfB6380B53E3A342A6e5B8a";

// Function to create a new token using the TokenFactory
async function createNewToken(name, symbol, initialSupply) {
  const account = await getAccount();
  const factoryContract = new web3.eth.Contract(tokenFactoryABI.abi, factoryContractAddress, {
    from: account,
  });

  const tx = await factoryContract.methods.createToken(name, symbol, initialSupply).send({
    from: account,
  });

  console.log("New token address:", tx.events.TokenCreated.returnValues[0]);
}



export default function Home() {
  return (
    <div className={styles.container}>
      <h1>My Dapp</h1>
      <button onClick={getBalance}>Get Balance</button>
      <button onClick={transferTokens}>Transfer Tokens</button>
      <button onClick={deployContract}>Deploy Contract</button>
      <button onClick={deployTokenFactory}>Deploy TokenFactory</button>
      <button onClick={() => createNewToken("MyToken", " MT", 1000000)}>Create New Token</button>
    </div>
  );
}
