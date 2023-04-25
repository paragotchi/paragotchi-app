//Dependencies
import {useState, useCallback, useContext, useEffect} from 'react';
import './App.css';

//Context
import ApiContext from './Context/ApiConnect'
import AccountsContext from './Context/Accounts'
import ChainInfoContext from './Context/ChainInfo';

//Utilities
import useApiSubscription from './Hooks/UnsubHook';
import NETWORKS from './Utils/networks';

//API Functions
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
import ParachainInfo from './Components/ParachainInfo';

const App = () => {
  //CONTEXT
  const {api, selectNetwork, isReady, network} = useContext(ApiContext);
  const {accounts, connectWallet, selectAccount} = useContext(AccountsContext);
  const {head} = useContext(ChainInfoContext);

  //STATE MANAGEMENT

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
  
  const getNewParaHeads = useCallback(() => {
    if(api){
      return api.query.paras.heads("2000", (newHead) => {
        setParaHead(newHead.toHuman())
      })
    }
  }, [api]);

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