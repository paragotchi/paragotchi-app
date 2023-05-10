//LEASE COMPONENT
// This will display the information related to the lease of a specific Parachain.
// Maximum Lease is 8 Lease Periods. We will alert owners if LP is lower than four (1 year Polkadot, 6m on Kusama),
// and we will critically alert if 2 or lower.

//TODO: if the chain is not a Parachain, this module does not make sense.

//Dependencies
import {useState, useContext, useEffect} from 'react';

//Context
import ChainInfoContext from '../../Context/ChainInfo';
import ParachainsContext from '../../Context/Parachains';
import AccountsContext from '../../Context/Accounts';

//Constants
const YELLOW_SLOT_ALERT = 4;
const RED_SLOT_ALERT = 2;

const LeasePeriod = () => {
  //CONTEXT
  const {currentLP, LPElapsed, leaseOffset, leaseDuration} = useContext(ChainInfoContext);
  const {slotsInfo} = useContext(ParachainsContext);
  const {userPara} = useContext(AccountsContext);

  //STATE MANAGEMENT
  const [remainingSlots, setRemainingSlots] = useState(null)
  const [slotStatus, setSlotStatus] = useState('Green')
  const [lastBlock, setLatsBlock] = useState(null)

  useEffect(() =>{
    let remaining_slots

    if (slotsInfo) {
      remaining_slots = slotsInfo.filter(slot => slot.paraID === userPara)
      remaining_slots = remaining_slots.length ? remaining_slots[0].remainingSlots : 0
      //need not to count the current one
      setRemainingSlots(remaining_slots - 1)
    }

    if (remainingSlots <= RED_SLOT_ALERT) {
      setSlotStatus("Red")
    } else if (remainingSlots <= YELLOW_SLOT_ALERT) {
      setSlotStatus("Yellow")
    } else if (remainingSlots) {
      setSlotStatus("Green")
    } else {
      setSlotStatus("No Slots")
    }

    if(remainingSlots){
      const lastBlock_ = leaseOffset + ((currentLP + remainingSlots + 1) * leaseDuration)
      setLatsBlock(lastBlock_)
    }

  }, [slotsInfo, currentLP, remainingSlots, userPara])


  return (
    <div>
      <div>
        <h2>Parachain Lease Period</h2>
        <h3>STATUS: {slotStatus}</h3>
      </div>
      <div>
        <p>Current Lease Period: {currentLP} ({Math.floor(LPElapsed*100)}% Elapsed)</p>
        <p>Last Lease Period: {currentLP && remainingSlots ? currentLP + remainingSlots : "calculating"}</p>
        <p>Slot lease ends by block: {lastBlock ? lastBlock : null}</p>
      </div>
    </div>
  );

}


export default LeasePeriod;