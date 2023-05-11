// This has the info from the parent Relay Chain that might be useful through the app.

//Dependencies
import React, { createContext, useEffect, useState, useCallback, useContext } from 'react';

//Context
import ApiContext from './ApiConnect'

//Utilities
import useApiSubscription from '../Hooks/UnsubHook';
import {blockToNumber} from '../Utils/helpers'

//API Functions
import { paraDeposit, dataDepositPerByte, leaseOffsetBlocks, leasePeriodDuration, durationEndingPeriod, gensisHash } from '../Api/constants'
import { parsedAuctions, getTimestamp, getHash } from '../Api/storage'

import {reserveID} from '../Api/submission'

const ChainInfoContext = createContext();

export default ChainInfoContext;

//Constants
// TIME_PERIOD will determine when to look for the last block to calculate avg block times.
// In this case, it will be the current block time vs the block time from 30000 blocks ago (if possible).
const TIME_PERIOD = 50000;

export function ChainInfo ({ children }) {
    // CONTEXT
    const {api, isReady} = useContext(ApiContext);

    // STATE MANAGEMENT
    // Subscriptions
    const [head, setNewHead] = useState(null)
    const [headHash, setNewHeadHash] = useState(null)
    const [timestamp, setTimestamp] = useState(null) 
    
    // Constants
    const [deposit, setDeposit] = useState(null)
    const [depositByByte, setdepositByByte] = useState(null)
    const [leaseOffset, setLeaseOffset] = useState(null)
    const [leaseDuration, setLeaseDuration] = useState(null)
    const [currentLP, setCurrentLP] = useState(null)
    const [LPElapsed, setLPElapsed] = useState(null)
    const [durationEP, setDurationEP] = useState(null)
    const [auctions, setAuctions] = useState([])
    const [avgBlockTime, setAvgBlockTime] = useState(null)

    const getNewHeads = useCallback(() => {
        if(api){
          return api.rpc.chain.subscribeNewHeads((lastHeader) => {
            const newHeight =  lastHeader.toHuman().number
            const newHeightHash = lastHeader.hash.toHuman()
            setNewHead(blockToNumber(newHeight));
            setNewHeadHash(newHeightHash);
          })
        }
    }, [api]);

    useApiSubscription(getNewHeads, isReady);


    const getCurrentTimestamp = useCallback(() => {
        if(api){
          return api.query.timestamp.now((moment) => {
            setTimestamp(blockToNumber(moment.toHuman()))
          })
        }
    }, [api]);

    useApiSubscription(getCurrentTimestamp, isReady);

    //State cleaner to be used when changing networks
    const cleanupState = () => {
        setDeposit(null);
        setdepositByByte(null);
        setLeaseOffset(null);
        setLeaseDuration(null);
        setCurrentLP(null);
        setLPElapsed(null);
        setDurationEP(null);
        setAvgBlockTime(null);
        setAuctions([]);
        setNewHeadHash(null);
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

        const test = async () => {
            reserveID(api)
        }

        if(api){
            cleanupState();
            getConsts();
            getStorage();
            // test();
        }
    
    },[api]);

    useEffect(() =>{
        if(head && leaseDuration && leaseOffset>=0){
            const _currentLP = (head - leaseOffset) / leaseDuration;
            setCurrentLP(Math.floor(_currentLP))
            setLPElapsed((_currentLP - Math.floor(_currentLP)))
        }
    },[api, head])

    useEffect(() => {
        let prevHead;
        if (head > TIME_PERIOD) {
            prevHead = head - TIME_PERIOD
        }

        const calcAvgTime = async () => { 
            let prevHeadHash;
            let prevHeadTimestamp;
            const currentHeadTimestamp = (await getTimestamp(api, headHash)).data;

            if(prevHead){
                prevHeadHash = (await getHash(api, prevHead)).data;
                prevHeadTimestamp = (await getTimestamp(api, prevHeadHash)).data;
            }else {
                //We will use genesis block until TIME_PERIOD can be reached.
                //TODO: Wil timestamp of geensis will be 0?
                prevHeadHash = (await gensisHash(api)).data;
                prevHeadTimestamp = (await getTimestamp(api, prevHeadHash)).data;
            }

            
            const _avgBlockTime = ((blockToNumber(currentHeadTimestamp) - blockToNumber(prevHeadTimestamp)) / TIME_PERIOD)/1000
            setAvgBlockTime(_avgBlockTime)
        }

        if(api && headHash && !avgBlockTime) {
            calcAvgTime();
        }
        
    },[headHash])

    return (
        <ChainInfoContext.Provider value={{head, deposit, depositByByte, leaseOffset, leaseDuration, currentLP, LPElapsed, auctions, durationEP, avgBlockTime, timestamp}}>
            { children }
        </ChainInfoContext.Provider>
    );
};