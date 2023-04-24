//LEASE COMPONENT
// This will display the information related to the lease of a specific Parachain.
// Maximum Lease is 8 Lease Periods. We will alert owners if LP is lower than four (1 year Polkadot, 6m on Kusama),
// and we will critically alert if 2 or lower.

//Dependencies
import {useState, useCallback, useContext, useEffect} from 'react';

//Constants
const YELLOW_SLOT_ALERT = 4;
const RED_SLOT_ALERT = 2;

const LeasePeriod = ({slots}) => {
  //for now it's fixed
  const PARAID = "2,000"

  //State Management
  const [remainingSlots, setRemainingSlots] = useState(null)
  const [slotStatus, setSlotStatus] = useState('green')

  useEffect(() =>{
    //TODO: this should re-render with a change on the paraID, but given that it's now fixed, we can't add that just yet.
    const remaining_slots = slots.slotsInfo.filter(slot => slot.paraID === PARAID)[0].remainingSlots
    setRemainingSlots(remaining_slots)

    if (remainingSlots <= RED_SLOT_ALERT) {
      setSlotStatus("red")
    } else if (remainingSlots <= YELLOW_SLOT_ALERT) {
      setSlotStatus("yellow")
    }

  }, [])


  return (
    <div>
      <div>
        <div>Parachain Lease Period</div>
        <div>STATUS: {slotStatus}</div>
      </div>
      <div>
        INFORMATION GOES HERE
      </div>
    </div>
  );

}


export default LeasePeriod;