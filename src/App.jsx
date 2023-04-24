//Dependencies
import {useState, useCallback, useContext, useEffect} from 'react';
import './App.css';

//Context
import ApiContext from './Context/ApiConnect'
import AccountsContext from './Context/Accounts'

//Utilities
import useApiSubscription from './Hooks/UnsubHook';
import NETWORKS from './Utils/networks';

//API Functions
import { paraDeposit, dataDepositPerByte } from './Api/constants'
import { nextFreeParaID, paras, currentCodeHash, currentHead, codeByHash, currentCodeHashSub } from './Api/storage'

const App = () => {
  //CONTEXT
  const {api, selectNetwork, isReady, network} = useContext(ApiContext);
  const {accounts, connectWallet, selectAccount} = useContext(AccountsContext);

  //STATE MANAGEMENT
  //Subscriptions
  const [head, setNewHead] = useState(null)

  //Constants
  const [deposit, setDeposit] = useState(null)
  const [depositByByte, setdepositByByte] = useState(null)

  //Storage Items
  const [nextId, setNextId] = useState(null)
  const [allParachains, setAllParachains] = useState([])
  const [paraCodeHash, setParaCodeHash] = useState(null)
  const [paraHead, setParaHead] = useState(null)
  const [paraCode, setParaCode] = useState(null)

  const handleClick = (chain, type) => {
    selectNetwork(chain, type)
  }

  useEffect(() =>{

    const getConsts = async () => {
      const depo = await paraDeposit(api)
      setDeposit(depo)
      
      const depositByte = await dataDepositPerByte(api)
      setdepositByByte(depositByte)
    }

    const getStorage = async () => {
      const nextParaId = await nextFreeParaID(api)
      setNextId(nextParaId)

      const allParas = await paras(api)
      console.log(allParas)
      setAllParachains(allParas)

      const _paraCodeHash = await currentCodeHash(api, 2000)
      setParaCodeHash(_paraCodeHash)


      const _paraHead = await currentHead(api, 2000)
      setParaHead(_paraHead)

    }

    if(api){
        getConsts();
        getStorage();
    }
  }, [api])

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

  const getNewParaHeads = useCallback(() => {
    if(api){
      return api.query.paras.heads(2000, (newHead) => {
        setParaHead(newHead.toHuman())
      })
    }
  }, [api]);

  useApiSubscription(getNewHeads, isReady);
  useApiSubscription(getNewParaHeads, isReady);

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

      <h1>Chain Constants</h1>
      {deposit && <p>Deposit: {deposit}</p>}
      {depositByByte && <p>Deposit by Byte: {depositByByte}</p>}

      <h1>Chain Storage</h1>
      {nextId && <p>Next ParaID: {nextId}</p>}
      {allParachains && allParachains.length && (
        allParachains.map(para => {
          return (
            <ul>
            <li>ParaId: {para.paraID}</li>
            <li>ParaOwner: {para.paraInfo.manager}</li>
            </ul>
          )
        })
      )}
      
      <h1>Account Details</h1>
      <p>All information is set for paraID 2000; still not dynamic</p>
      {paraCodeHash && <p>Para Code Hash: {paraCodeHash}</p>}
      {paraHead && <p>Para Code Head: {paraHead}</p>}
    </div>
  );

}


export default App;