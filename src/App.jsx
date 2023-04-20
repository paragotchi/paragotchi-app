//Dependencies
import {useState, useCallback, useContext} from 'react';
import './App.css';

//Context
import ApiContext from './Context/ApiConnect'
import AccountsContext from './Context/Accounts'

//Utilities
import useApiSubscription from './Hooks/UnsubHook';

const App = () => {

  const [head, setNewHead] = useState(null)

  const {api, selectNetwork, isReady} = useContext(ApiContext);
  const {accounts, connectWallet, selectAccount} = useContext(AccountsContext);

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

  const getNewHeads = useCallback(() => {
    if(api){
      return api.rpc.chain.subscribeNewHeads((lastHeader) => {
        const newHeight =  lastHeader.toHuman().number
        setNewHead(newHeight);
      })
    }
  }, [api]);

  useApiSubscription(getNewHeads, isReady);

  return (
    
    <div className="App">
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
      
    </div>
  );

}


export default App;