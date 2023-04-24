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
import { 
  nextFreeParaID, 
  currentCodeHash, 
  currentHead, 
  codeByHash, 
  currentCodeHashSub, 
  parasFullDetails,
  pendingSwaps,
  hrmpChannels,
  futureCodeHash,
  futureCodeUpgrades,
  slots
} from './Api/storage'

//Components
import LeasePeriod from './Components/LeasePeriod';

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
  const [swaps, setSwaps] = useState(null)
  const [hrmp, setHrmp] = useState(null)
  const [futureParaCodeHash, setFutureParaCodeHash] = useState(null)
  const [futureParaCodeBlock, setFutureParaCodeBlock] = useState(null)
  const [slotsInfo, setSlotsInfo] = useState(null)

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

      const allParas = await parasFullDetails(api)
      setAllParachains(allParas)

      const _paraCodeHash = await currentCodeHash(api, "2000")
      setParaCodeHash(_paraCodeHash)

      const _paraHead = await currentHead(api, "2000")
      setParaHead(_paraHead)

      const _swaps = await pendingSwaps(api)
      //TODO: This needs some refactoring. Should we add this to a general state, together with all parachains?
      // filterForPara(_hrmp,'swaps')
      setSwaps(_swaps)

      const _hrmp = await hrmpChannels(api)
      //TODO: This needs some refactoring. Should we add this to a general state, together with all parachains?
      const filteredHrpm = filterForPara(_hrmp)
      setHrmp(filteredHrpm)

      const _futureParaCodeHash = await futureCodeHash(api, "2000")
      setFutureParaCodeHash(_futureParaCodeHash)

      const _futureParaCodeBlock = await futureCodeUpgrades(api,"2000")
      setFutureParaCodeBlock(_futureParaCodeBlock)

      const _slotsInfo = await slots(api)
      setSlotsInfo(_slotsInfo)

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
      return api.query.paras.heads("2000", (newHead) => {
        setParaHead(newHead.toHuman())
      })
    }
  }, [api]);

  useApiSubscription(getNewHeads, isReady);
  useApiSubscription(getNewParaHeads, isReady);

  const filterForPara = (data) =>{
    const paraID = '2,000'
    const filteredData = data.filter(d => d.sender === paraID || d.recipient === paraID);
    return filteredData;
  }

  return (
    
    <div className="App">
      <h1>CHAIN: {NETWORKS[network] && NETWORKS[network].name}</h1>
      <h1>HEAD: {head}</h1>

      <h1>COMPONENTS CHECK</h1>
      <LeasePeriod slots={{slotsInfo}}/>

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
      <dl>
      {allParachains && allParachains.length && (
        allParachains.map(para => {
          return (
            <>
              <dt>
                <dd>ParaId: {para.paraID}</dd>
                <dd>ParaOwner: {para.paraInfo.manager}</dd>
                <dd>Stage: {para.stage ? para.stage : "unregistered"}</dd>
              </dt>
              <hr></hr>
            </>
          )
        })
      )}
      </dl>
      <h1>Account Details</h1>
      <small>All information is set for paraID 2000; still not dynamic</small>

      <h2>Current State</h2>
      {paraCodeHash && <p>Para Code Hash: {paraCodeHash}</p>}
      {paraHead && <p>Para Code Head: {paraHead}</p>}

      <h3>HRMP Channels</h3>
      {hrmp && hrmp.length 
        ? (
          <ul>
            {hrmp.map(channel => <li>Sender: {channel.sender} {`=>`} recipient: {channel.recipient}</li>)}
          </ul>
        )
        : <p>No Channels Opened</p>
      }

      <h2>Future State</h2>
      
      {futureParaCodeHash 
        ? <p>Future Para Code Hash: {futureParaCodeHash}</p>
        : <p>No Upgrade planned</p>
      }

      {futureParaCodeBlock 
        ? <p>Block for future Para Code Hash: {futureParaCodeBlock}</p>
        : <p>No Upgrade planned</p>
      }

    </div>
  );

}


export default App;