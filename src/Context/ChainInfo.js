// This has the info from the parent Relay Chain that might be useful through the app.

//Dependencies
import React, { createContext, useEffect, useState, useCallback, useContext } from 'react';

//Context
import ApiContext from './ApiConnect'

//Utilities
import useApiSubscription from '../Hooks/UnsubHook';
import {blockToNumber} from '../Utils/helpers'

//API Functions
import { paraDeposit, dataDepositPerByte, leaseOffsetBlocks, leasePeriodDuration } from '../Api/constants'

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

    const getNewHeads = useCallback(() => {
        if(api){
          return api.rpc.chain.subscribeNewHeads((lastHeader) => {
            const newHeight =  lastHeader.toHuman().number
            setNewHead(blockToNumber(newHeight));
          })
        }
    }, [api]);

    useApiSubscription(getNewHeads, isReady);

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
        }

        if(api){
            getConsts();
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
        <ChainInfoContext.Provider value={{head, deposit, depositByByte, leaseOffset, leaseDuration, currentLP, LPElapsed}}>
            { children }
        </ChainInfoContext.Provider>
    );
};