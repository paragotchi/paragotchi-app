//PARACHAIN INFO
// This will display the information related to the head and wasm of a specific parachain.
// Users will be able to see current head and current wasm code, as well as future if there are any.


//Dependencies
import {useState, useContext, useCallback, useEffect} from 'react';

//Context
import ParachainsContext from '../../Context/Parachains';
import ApiContext from '../../Context/ApiConnect';
import AccountsContext from '../../Context/Accounts';

//Utilities
import useApiSubscription from '../../Hooks/UnsubHook';
//TODO: REFACTOR ALL INCOMING NUMBERS AND MAKE THEM...NUMBERS
import {blockToNumber} from '../../Utils/helpers'

//API Functions
import { 
    currentCodeHash, 
    currentHead, 
    futureCodeHash,
    futureCodeUpgrades,
} from '../../Api/storage'


const ParachainInfo = () => {

  //CONTEXT
  const {allParachains} = useContext(ParachainsContext);
  const {api, isReady} = useContext(ApiContext);
  const {userPara} = useContext(AccountsContext);

  //STATE MANAGEMENT
  const [paraInfo, setParaInfo] = useState(null)
  const [paraHead, setParaHead] = useState(null)
  const [paraCodeHash, setParaCodeHash] = useState(null)
  const [futureParaCodeHash, setFutureParaCodeHash] = useState(null)
  const [futureParaCodeBlock, setFutureParaCodeBlock] = useState(null)

  useEffect(() =>{
    //TODO: this should re-render with a change on the paraID, but given that it's now fixed, we can't add that just yet.
    const getStorage = async () => {
        const _paraCodeHash = await currentCodeHash(api, blockToNumber(userPara))
        setParaCodeHash(_paraCodeHash.data)

        const _paraHead = await currentHead(api, blockToNumber(userPara))
        setParaHead(_paraHead.data)

        const _futureParaCodeHash = await futureCodeHash(api, blockToNumber(userPara))
        setFutureParaCodeHash(_futureParaCodeHash.data)
  
        const _futureParaCodeBlock = await futureCodeUpgrades(api,blockToNumber(userPara))
        setFutureParaCodeBlock(_futureParaCodeBlock.data)
    }

    if(api){
        getStorage();
    }

  }, [api, userPara])

  useEffect(() =>{
    if (allParachains) {
        const _paraInfo = allParachains.filter(para => para.paraID === userPara)[0]
        setParaInfo(_paraInfo)
    }

  }, [allParachains, userPara])

  const getNewParaHeads = useCallback(() => {
    if(api){
      return api.query.paras.heads(blockToNumber(userPara), (newHead) => {
        setParaHead(newHead.toHuman())
      })
    }
  }, [api, userPara]);

  useApiSubscription(getNewParaHeads, isReady);

  const trimHead = (head) => {
    const headLength = head.length
    const first = head.slice(0,5)
    const end = head.slice(headLength - 5)
    return first.concat("...", end);
  }


  return (
    <div>
      <div>
        <h2>Parachain Info</h2>
        <h3>STATUS: {paraInfo && paraInfo.stage}</h3>
        {/* <h3>STATUS: TODO: ADD if producing blocks</h3> */}
      </div>
      <div>
        <h4>Current Info</h4>
        <p>Current Head: {paraHead ? trimHead(paraHead) : "fetching"}</p>
        <p>Current Wasm Hash: {paraCodeHash ? paraCodeHash : "fetching"} </p>
        <h4>Future Info</h4>
        <p>Future Wasm Hash: {futureParaCodeHash ? futureParaCodeHash : "No Upgrade Planned"}</p>
        <p>Execution Block: {futureParaCodeBlock ? futureParaCodeBlock : "No Upgrade Planned"} </p>
      </div>
    </div>
  );

}


export default ParachainInfo;