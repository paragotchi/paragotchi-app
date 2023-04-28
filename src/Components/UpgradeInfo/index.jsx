//UPGRADE INFO
// This will display the head and hash of the wasm of any future upgrade, if planned.


//Dependencies
import {useState, useContext, useEffect} from 'react';

//Context
import ApiContext from '../../Context/ApiConnect';
import AccountsContext from '../../Context/Accounts';

//TODO: REFACTOR ALL INCOMING NUMBERS AND MAKE THEM...NUMBERS
import {blockToNumber} from '../../Utils/helpers'

//API Functions
import { 
    futureCodeHash,
    futureCodeUpgrades,
} from '../../Api/storage'

//Components
import ExportWasm from '../ExportWasm';


const UpgradeInfo = () => {

  //CONTEXT
  const {api} = useContext(ApiContext);
  const {userPara} = useContext(AccountsContext);

  //STATE MANAGEMENT
  const [futureParaCodeHash, setFutureParaCodeHash] = useState(null)
  const [futureParaCodeBlock, setFutureParaCodeBlock] = useState(null)
  const [willUpgrade, setWillUpgrade] = useState(false);

  useEffect(() =>{
    //TODO: this should re-render with a change on the paraID, but given that it's now fixed, we can't add that just yet.
    const getStorage = async () => {
        const _futureParaCodeHash = await futureCodeHash(api, blockToNumber(userPara))
        setFutureParaCodeHash(_futureParaCodeHash.data)
  
        const _futureParaCodeBlock = await futureCodeUpgrades(api,blockToNumber(userPara))
        setFutureParaCodeBlock(_futureParaCodeBlock.data)
    }

    if(api){
        getStorage();
    }

    if(futureParaCodeHash) {
        setWillUpgrade(true)
    }

  }, [api, userPara])


  return (
    <div>
      <div>
        <h2>Upgrade Information</h2>
        <h3>STATUS: {willUpgrade ? "Upgrade Planned" : "No Upgrade Planned"}</h3>
        {/* <h3>STATUS: TODO: ADD if producing blocks</h3> */}
      </div>
      {willUpgrade && 
      <div>
        <p>Future Wasm Hash: {futureParaCodeHash ? futureParaCodeHash : "Loading"}</p>
        {futureParaCodeHash &&
          <ExportWasm wasmHash={futureParaCodeHash} />
        }
        <p>Execution Block: {futureParaCodeBlock ? futureParaCodeBlock : "Loading"} </p>
      </div>
      }
    </div>
  );

}


export default UpgradeInfo;