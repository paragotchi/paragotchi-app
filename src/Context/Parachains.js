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
    slots,
    parsedAuctions
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
    const [allParaIds, setAllParaIds] = useState([])

    useEffect(() =>{
        const getStorage = async () => {
            const _nextId = await nextFreeParaID(api)
            setNextId(_nextId.data)
      
            const _allParachains = await parasFullDetails(api)
            setAllParachains(_allParachains.data)

            const _allParaIDs = _allParachains.data.map(para => para.paraID);
            setAllParaIds(_allParaIDs)
      
            const _swaps = await pendingSwaps(api)
            //TODO: This needs some refactoring. Should we add this to a general state, together with all parachains?
            // filterForPara(_hrmp,'swaps')
            setSwaps(_swaps.data)
      
            const _hrmp = await hrmpChannels(api)
            //TODO: This needs some refactoring. Should we add this to a general state, together with all parachains?
            setHrmp(_hrmp.data)
      
            const _slotsInfo = await slots(api)
            setSlotsInfo(_slotsInfo.data)
        }

        if(api){
            cleanupState();
            getStorage();
        }
    
    },[api]);

    //State cleaner to be used when changing networks
    const cleanupState = () => {
        setNextId(null);
        setAllParachains([]);
        setSwaps(null);
        setHrmp(null);
        setSlotsInfo(null);
        setAllParaIds([]);
    }

    return (
        <ParachainsContext.Provider value={{nextId, allParachains, swaps, hrmp, slotsInfo, allParaIds}}>
            { children }
        </ParachainsContext.Provider>
    );
};