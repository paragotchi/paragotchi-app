//Dependencies
import {useState, useCallback, useContext, useEffect} from 'react';
import './App.css';

//Context
import ApiContext from './Context/ApiConnect'
import AccountsContext from './Context/Accounts'
import ChainInfoContext from './Context/ChainInfo';

//Utilities
import NETWORKS from './Utils/networks';

//Components
import LeasePeriod from './Components/LeasePeriod';
import ParachainInfo from './Components/ParachainInfo';

const App = () => {
  //CONTEXT
  const { selectNetwork, network} = useContext(ApiContext);
  const {accounts, connectWallet, selectAccount} = useContext(AccountsContext);
  const {head} = useContext(ChainInfoContext);

  //STATE MANAGEMENT

  const handleClick = (chain, type) => {
    selectNetwork(chain, type)
  }

  const handleConnectAccount = () => {
    connectWallet()
    console.log(accounts)
  }

  const handleAccountSelect = (event) => {
    selectAccount(event.target.value)
  }

  return (
    
    <div className="App">
      <h1>CHAIN: {NETWORKS[network] && NETWORKS[network].name}</h1>
      <h1>HEAD: {head}</h1>

      <h2>RPC</h2>
      
      <button onClick={() => handleClick('kusama', 'rpc')}>Kusama</button>
      <button onClick={() => handleClick('polkadot', 'rpc')}>polkadot</button>
      <button onClick={() => handleClick('westend', 'rpc')}>westend</button>
      <button onClick={() => handleClick('rococo', 'rpc')}>rococo</button>

      <h1>ACCOUNTS</h1>
      {!accounts.length ? (
        <button onClick={() => handleConnectAccount()}>Connect Accounts</button>
      ) : (
        <select name="cars" id="cars">
          {accounts.map(acc => <option value={acc.address} onClick={handleAccountSelect}>{acc.meta.name}</option>)}
        </select>
      )}

      <h1>COMPONENTS CHECK</h1>
      <LeasePeriod />
      <ParachainInfo />
    </div>
  );

}


export default App;