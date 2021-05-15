import React, { Component } from "react";
import { Box, Grommet, Header, Heading, Nav } from 'grommet';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';

import SupplyChainContract from "./contracts/SupplyChain.json";
import getWeb3 from "./getWeb3";
import {
  Home,
  Distributor,
  Consumer,
  Farmer,
  Retailer
} from './pages';
import theme from './assets/theme'
import { AccountContext, ContractContext } from './utils'
class App extends Component {
  state = {
    web3: null, currentAccount: null, contract: null, accountType: null
  };

  componentDidMount = async () => {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SupplyChainContract.networks[networkId];
      // deployedNetwork.address = '0x90A920250eF6c4cdF2B41CdA72738DF9e280E4Df';
      const instance = new web3.eth.Contract(
        SupplyChainContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      instance.options.address = '0x90A920250eF6c4cdF2B41CdA72738DF9e280E4Df';

      window.ethereum.on('accountsChanged', () => {
        web3.eth.getAccounts((error, accounts) => {
          if (error) { return; };
          this.setState({ currentAccount: accounts[0] }, this.setAccountType);
        });
      });

      this.setState({ web3, contract: instance, currentAccount: accounts[0] }, this.setAccountType);
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  async setAccountType() {
    const { currentAccount, contract } = this.state;
    const isFarmer = await contract.methods.isFarmer(currentAccount).call();
    if (isFarmer) {
      return this.setState({ accountType: 'FARMER' });
    }
    const isDistributor = await contract.methods.isDistributor(currentAccount).call();
    if (isDistributor) {
      return this.setState({ accountType: 'DISTRIBUTOR' });
    }
    const isRetailer = await contract.methods.isRetailer(currentAccount).call();
    if (isRetailer) {
      return this.setState({ accountType: 'RETAILER' });
    }
    const isConsumer = await contract.methods.isConsumer(currentAccount).call();
    if (isConsumer) {
      return this.setState({ accountType: 'CONSUMER' });
    }
  }

  getDashboardComponent() {
    const { accountType } = this.state;
    const accountTypeToPage = {
      'FARMER': Farmer,
      'DISTRIBUTOR': Distributor,
      'RETAILER': Retailer,
      'CONSUMER': Consumer
    };
    return accountTypeToPage[accountType];
  }

  render() {
    const { web3, contract, currentAccount } = this.state;
    const DashboardComponent = this.getDashboardComponent();
    if (!web3) {
      return <Heading level="3">Loading Web3, accounts, and contract...</Heading>;
    }
    return (
      <Grommet theme={theme}>
        <Router basename="/">
          <Header pad="small" background="brand">
            <Box align="center" gap="small" direction="row">
            <Link to="/">
              <Heading level="3" color="accent-1">
                Farm2TableChain
              </Heading>
            </Link>
            </Box>
            <Nav direction="row">
              {
                !DashboardComponent &&
                <Link to="/signUp">Sign Up</Link>
              }
              {
                DashboardComponent && 
                <Link to="/dashboard">Dashboard</Link>
              }
            </Nav>
          </Header>
          <ContractContext.Provider value={contract}>
            <AccountContext.Provider value={currentAccount}>
              <Switch>
                <Route component={DashboardComponent} path="/dashboard" />
                <Route component={Home} path="/" /> 
              </Switch>
            </AccountContext.Provider>
          </ContractContext.Provider>
        </Router>
      </Grommet>
    );
  }
}

export default App;
