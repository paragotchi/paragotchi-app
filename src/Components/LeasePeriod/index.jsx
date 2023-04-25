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

//Constants
const YELLOW_SLOT_ALERT = 4;
const RED_SLOT_ALERT = 2;

const LeasePeriod = () => {
  //for now it's fixed
  const PARAID = "2,000"

  //CONTEXT
  const {currentLP, LPElapsed, leaseOffset, leaseDuration} = useContext(ChainInfoContext);
  const {slotsInfo} = useContext(ParachainsContext);

  //STATE MANAGEMENT
  const [remainingSlots, setRemainingSlots] = useState(null)
  const [slotStatus, setSlotStatus] = useState('Green')
  const [lastBlock, setLatsBlock] = useState(null)

  useEffect(() =>{
    //TODO: this should re-render with a change on the paraID, but given that it's now fixed, we can't add that just yet.
    let remaining_slots

    if (slotsInfo) {
      remaining_slots = slotsInfo.filter(slot => slot.paraID === PARAID)
      remaining_slots = remaining_slots.length ? remaining_slots[0].remainingSlots : 0
      setRemainingSlots(remaining_slots)
    }
    

    if (remainingSlots <= RED_SLOT_ALERT) {
      setSlotStatus("Red")
    } else if (remainingSlots <= YELLOW_SLOT_ALERT) {
      setSlotStatus("Yellow")
    }

    if(remainingSlots){
      const lastBlock_ = leaseOffset + ((currentLP + remainingSlots + 1) * leaseDuration)
      setLatsBlock(lastBlock_)
    }

  }, [slotsInfo, currentLP, remainingSlots])


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