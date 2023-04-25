//Dependencies
import {useState, useCallback, useContext, useEffect} from 'react';
import './App.css';

//Context
import ApiContext from './Context/ApiConnect'
import AccountsContext from './Context/Accounts'
import ChainInfoContext from './Context/ChainInfo';
import ParachainsContext from './Context/Parachains';

//Utilities
import NETWORKS from './Utils/networks';

//Components
import LeasePeriod from './Components/LeasePeriod';
import ParachainInfo from './Components/ParachainInfo';

const App = () => {
  //CONTEXT
  const { selectNetwork, network} = useContext(ApiContext);
  const {accounts, connectWallet, selectAccount, userParaSelection, userPara} = useContext(AccountsContext);
  const {head} = useContext(ChainInfoContext);
  const {allParaIds} = useContext(ParachainsContext);

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

  const handlePAraSelect = (event) => {
    userParaSelection(event.target.value)
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
        <select name="accounts" id="accounts">
          {accounts.map(acc => <option key={acc.address} value={acc.address} onClick={handleAccountSelect}>{acc.meta.name}</option>)}
        </select>
      )}

      <h1>PARAS</h1>
      {!allParaIds.length 
        ? <p>Loading</p> 
        : (
        <select name="paras" id="paras">
          {allParaIds.map(para => <option key={para} value={para} onClick={handlePAraSelect}>{para}</option>)}
        </select>
        )
      }
      { userPara 
        ? <div>
          <h1>INFORMATION DISPLAYED FOR PARA {userPara}</h1>
          <LeasePeriod />
          <ParachainInfo />
        </div>
        : <div>
          <h3>Please select a paraID</h3>
        </div>
      }
    </div>
  );

}


export default App;