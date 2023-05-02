// This has the info from the parent Relay Chain that might be useful through the app.

//Dependencies
import React, { createContext, useEffect, useState, useCallback, useContext } from 'react';

//Context
import ApiContext from './ApiConnect'

//Utilities
import useApiSubscription from '../Hooks/UnsubHook';
import {blockToNumber} from '../Utils/helpers'

//API Functions
import { paraDeposit, dataDepositPerByte, leaseOffsetBlocks, leasePeriodDuration, durationEndingPeriod } from '../Api/constants'
import { parsedAuctions } from '../Api/storage'

const ChainInfoContext = createContext();

export default ChainInfoContext;

export function ChainInfo ({ children }) {
    // CONTEXT
    const {api, isReady} = useContext(ApiContext);

    // STATE MANAGEMENT
    // Subscriptions
    const [head, setNewHead] = useState(null)
    
    // Constants
    const [deposit, setDeposit] = useState(null)
    const [depositByByte, setdepositByByte] = useState(null)
    const [leaseOffset, setLeaseOffset] = useState(null)
    const [leaseDuration, setLeaseDuration] = useState(null)
    const [currentLP, setCurrentLP] = useState(null)
    const [LPElapsed, setLPElapsed] = useState(null)
    const [durationEP, setDurationEP] = useState(null)
    const [auctions, setAuctions] = useState([])

    const getNewHeads = useCallback(() => {
        if(api){
          return api.rpc.chain.subscribeNewHeads((lastHeader) => {
            const newHeight =  lastHeader.toHuman().number
            setNewHead(blockToNumber(newHeight));
          })
        }
    }, [api]);

    useApiSubscription(getNewHeads, isReady);

    //State cleaner to be used when changing networks
    const cleanupState = () => {
        setDeposit(null);
        setdepositByByte(null);
        setLeaseOffset(null);
        setLeaseDuration(null);
        setCurrentLP(null);
        setLPElapsed(null);
        setDurationEP(null);
        setAuctions([]);
    }

    useEffect(() =>{

        const getConsts = async () => {
            const _deposit = await paraDeposit(api)
            setDeposit(_deposit.data)
            
            const _depositByte = await dataDepositPerByte(api)
            setdepositByByte(_depositByte.data) 
            
            const _leaseOffset = await leaseOffsetBlocks(api)
            setLeaseOffset(_leaseOffset.data)   
            
            const _leaseDuration = await leasePeriodDuration(api)
            setLeaseDuration(_leaseDuration.data)
            
            const _durationEndingPeriod = await durationEndingPeriod(api)
            setDurationEP(_durationEndingPeriod.data)

        }

        const getStorage = async () => {
            const _parsedAuctions = await parsedAuctions(api)
            //TODO: Investigate how to do this properly.
            // Throw errors? Handle these like this?
            if(_parsedAuctions.status === 'success') { setAuctions(_parsedAuctions.data) }
        }

        if(api){
            cleanupState();
            getConsts();
            getStorage();
        }
    
    },[api]);

    useEffect(() =>{
        if(head && leaseDuration && leaseOffset>=0){
            const _currentLP = (head - leaseOffset) / leaseDuration;
            setCurrentLP(Math.floor(_currentLP))
            setLPElapsed((_currentLP - Math.floor(_currentLP)))
        }
    },[api, head])

    return (
        <ChainInfoContext.Provider value={{head, deposit, depositByByte, leaseOffset, leaseDuration, currentLP, LPElapsed, auctions, durationEP}}>
            { children }
        </ChainInfoContext.Provider>
    );
};