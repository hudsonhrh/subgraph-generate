'use client'

import styles from "./page.module.css";

// Import Web3
import Web3 from 'web3';

// Import contract ABI
import tokenABI from "../abi/Token.json";

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

export default function Home() {
  return (
    <div className={styles.container}>
      <h1>My Dapp</h1>
      <button onClick={getBalance}>Get Balance</button>
      <button onClick={transferTokens}>Transfer Tokens</button>
      <button onClick={deployContract}>Deploy Contract</button>
    </div>
  );
}
