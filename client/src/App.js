import React, { Component } from "react";
import { Box, Grommet, Header, Heading } from 'grommet';

import SupplyChainContract from "./contracts/SupplyChain.json";
import getWeb3 from "./getWeb3";
import theme from './assets/theme'
import { AccountContext, ContractContext } from './utils'
import Dashboard from './Dashboard';
class App extends Component {
  constructor() {
    super();
    this.state = {
      web3: null, currentAccount: null, contract: null, accountType: null
    };
    this.fetchItemBufferOne = this.fetchItemBufferOne.bind(this);
    this.fetchItemBufferTwo = this.fetchItemBufferTwo.bind(this);
  }

  componentDidMount = async () => {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SupplyChainContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SupplyChainContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      window.ethereum.on('accountsChanged', () => {
        web3.eth.getAccounts((error, accounts) => {
          if (error) { return; };
          this.setState({ currentAccount: accounts[0] }, this.setAccountType);
        });
      });
      
      const gasPrice = Number(await web3.eth.getGasPrice());
      this.setState({
        web3,
        contract: instance,
        currentAccount: accounts[0],
        gasPrice,
      }, this.setAccountType);
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  async setAccountType() {
    const { currentAccount, contract } = this.state;
    const isFarmer = await contract.methods.isFarmer(currentAccount);
    if (isFarmer) {
      return this.setState({ accountType: 'FARMER' });
    }
    const isDistributor = await contract.methods.isDistributor(currentAccount);
    if (isDistributor) {
      return this.setState({ accountType: 'DISTRIBUTOR' });
    }
    const isRetailer = await contract.methods.isRetailer(currentAccount);
    if (isRetailer) {
      return this.setState({ accountType: 'RETAILER' });
    }
    const isConsumer = await contract.methods.isConsumer(currentAccount);
    if (isConsumer) {
      return this.setState({ accountType: 'CONSUMER' });
    }
  }

  async fetchItemBufferOne(_upc) {
    const { contract } = this.state; 
    const data = await contract.methods.fetchItemBufferOne(_upc);
    return parseInt(data.itemSKU) > 0 ? data : null;
  }

  async fetchItemBufferTwo(_upc) {
    const { contract } = this.state; 
    const data = await contract.methods.fetchItemBufferTwo(_upc);
    return parseInt(data.itemSKU) > 0 ? data : null;
  }

  render() {
    const { web3, contract, gasPrice, currentAccount, accountType } = this.state;
    if (!web3) {
      return <Heading level="3">Loading Web3, accounts, and contract...</Heading>;
    }
    return (
      <Grommet theme={theme}>
        <Header pad={{ vertical: 'small', horizontal: 'large'}} background="brand">
          <Box align="center" gap="small" direction="row">
            <Heading level="3" color="accent-1">
              Farm2Table
            </Heading>
          </Box>
        </Header>
        <ContractContext.Provider value={{
          web3,
          contract,
          gasPrice,
          fetchItemFarmInfo: this.fetchItemBufferOne,
          fetchItemSaleInfo: this.fetchItemBufferTwo,
        }}>
          <AccountContext.Provider value={{
            account: currentAccount, accountType
          }}>
            <Dashboard />
          </AccountContext.Provider>
        </ContractContext.Provider>
      </Grommet>
    );
  }
}

export default App;
