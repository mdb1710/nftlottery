import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import Lottery from "./contracts/Lottery.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null, balance: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      let deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        
        // '0x6AA80f9795770FED8D4d2d63055E9Ea13ED0A8b4',
        deployedNetwork && deployedNetwork.address,
      );
      deployedNetwork = Lottery.networks[networkId];
      
      const lotteryInstance = new web3.eth.Contract(
        Lottery.abi,
        deployedNetwork && deployedNetwork.address
      )

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance, lotteryContract: lotteryInstance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract, lotteryContract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.set(5).send({ from: accounts[0] });

    const amount = await lotteryContract.methods.getBalance()

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ 
      storageValue: response,
      balance: amount 
    });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>
        <p>
          Try changing the value stored on <strong>line 40</strong> of App.js.
        </p>
        <div>The stored value is: {this.state.storageValue}</div>
        <div>The new stored value is coming soon</div>
        <div>
          <form onSubmit={console.log(this.state.balance)}>
            <fieldset>
              <label>
                Try this:
                <input />
              </label>
            </fieldset>
            <button type='submit'>Submit</button>
          </form>
        </div>
      </div>
    );
  }
}

export default App;