// This has the info from the parent Relay Chain that might be useful through the app.

//Dependencies
import React, { createContext, useEffect, useState, useContext } from 'react';

//Context
import ApiContext from './ApiConnect'

//Utilities
import {blockToNumber} from '../Utils/helpers'

//API Functions
import { 
    nextFreeParaID,  
    parasFullDetails,
    pendingSwaps,
    hrmpChannels,
    slots
  } from '../Api/storage'

const ParachainsContext = createContext();

export default ParachainsContext;

export function Parachains ({ children }) {
    // CONTEXT
    const {api} = useContext(ApiContext);

    // STATE MANAGEMENT
    //Storage Items
    const [nextId, setNextId] = useState(null)
    const [allParachains, setAllParachains] = useState([])
    const [swaps, setSwaps] = useState(null)
    const [hrmp, setHrmp] = useState(null)
    const [slotsInfo, setSlotsInfo] = useState(null)

    useEffect(() =>{
        const getStorage = async () => {
            const nextId_ = await nextFreeParaID(api)
            setNextId(nextId_)
      
            const allParachains_ = await parasFullDetails(api)
            setAllParachains(allParachains_)
      
            const _swaps = await pendingSwaps(api)
            //TODO: This needs some refactoring. Should we add this to a general state, together with all parachains?
            // filterForPara(_hrmp,'swaps')
            setSwaps(_swaps)
      
            const _hrmp = await hrmpChannels(api)
            //TODO: This needs some refactoring. Should we add this to a general state, together with all parachains?
            setHrmp(_hrmp)
      
            const _slotsInfo = await slots(api)
            setSlotsInfo(_slotsInfo)
        }

        if(api){
            getStorage();
        }
    
    },[api]);

    return (
        <ParachainsContext.Provider value={{nextId, allParachains, swaps, hrmp, slotsInfo}}>
            { children }
        </ParachainsContext.Provider>
    );
};