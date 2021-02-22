import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { AdvancedStorageABI } from "./contractAbi/AdvancedStorageABI.js";

import "./App.css";

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:4444"));

// web3.eth.defaultAccount = web3.eth.accounts[0];

const AdvStorageContract = new web3.eth.Contract(
  AdvancedStorageABI,
  "0xdac5481925A298B95Bf5b54c35b68FC6fc2eF423"
);

const App = () => {
  const [balance, setBalance] = useState(0);
  const [id, setId] = useState(0);
  const [position, setPosition] = useState([]);
  const [address, setAddress] = useState("");
  const [output, setOutput] = useState([]);

  const getMyBalance = () => {
    web3.eth.getBalance(
      "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826",
      function (err, result) {
        if (err) {
          console.log(err);
        } else {
          setBalance(web3.utils.fromWei(result, "ether") + " ETH");
        }
      }
    );
  };
  getMyBalance();

  const getAdrresses = async () => {
    const accounts = await web3.eth.getAccounts();
    const account1 = accounts[0];
    setAddress(account1);
  };
  getAdrresses();

  const addId = async (e) => {
    e.preventDefault();
    // const metamaskAccounts = await window.ethereum.enable();

    const gas = await AdvStorageContract.methods.add(id).estimateGas();
    const result = await AdvStorageContract.methods
      .add(id)
      .send({ from: "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826", gas });
    console.log(result);
  };

  const getId = async (e) => {
    e.preventDefault();
    const result = await AdvStorageContract.methods.get(position).call();
    console.log("ID:", result);
    setOutput(result);
  };

  const getAllIds = async (e) => {
    const results = await AdvStorageContract.methods.getAll().call();
    console.log("allIds", results);
    const separatedResult = results.map((result) => result).join(", ");
    setOutput(separatedResult);
  };

  const getIdsLength = async (e) => {
    const result = await AdvStorageContract.methods.length().call();
    console.log("length: ", result);
    setOutput(result);
  };

  return (
    <div className="App">
      <h2>RSK</h2>
      <h4>Account: {address}</h4>
      <h3>Balance: {balance}</h3>

      <form onSubmit={addId}>
        <label>
          Set ID:
          <input
            type="text"
            name="id"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
        </label>
        <input type="submit" value="Set ID" />
      </form>
      <br />
      {output}
      <br />
      <br />
      <form onSubmit={getId}>
        <label>
          Get ID:
          <input
            type="text"
            name="position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />
        </label>
        <input type="submit" value="Get ID" />
      </form>
      <br />
      <button onClick={getAllIds} type="button">
        Get All IDs
      </button>
      <br />
      <br />
      <button onClick={getIdsLength} type="button">
        Get the length
      </button>
    </div>
  );
};

export default App;
