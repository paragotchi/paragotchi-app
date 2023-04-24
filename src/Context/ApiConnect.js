//Dependencies
import React, { createContext, useState, useEffect } from 'react';
import { ApiPromise, WsProvider } from "@polkadot/api";

//Utilities
import NETWORKS from '../Utils/networks';


const ApiContext = createContext();

export default ApiContext;

export function ApiConnect ({ children }) {
    const [api, setConnectedApi] = useState(null);
    const [isReady, setIsReady] = useState(false);
    const [network, setNetwork] = useState("polkadot")
    const [connectionType, setConnectionType] = useState('RPC');
    const [provider, setProvider] = useState(null);

    // by default this connects to Polkadot
    useEffect(() =>{
        const startApi = async () => {
            await selectNetwork(network, connectionType);
        }
        if(!provider){
            startApi();
        }
    })

    //CHOOSE LIGHT CLIENT OR RPC CONNECTION
    const selectNetwork = async (chainID, type) => {
        cleanupState()
        
        await selectNetworkRPC(chainID)
        
        setConnectionType(type)
        setNetwork(chainID)
    };

    //CONNECTS TO RPC
    //TODO: Make it so that user could also determine it's own RPC endpoint
    const selectNetworkRPC = async (chainID) => {
        //If user changes network it will first disconnect the current ws connection.
        if(provider){
            await provider.disconnect();
        }

        if(chainID){
            const newProvider = new WsProvider(NETWORKS[chainID].RPC);
            setProvider(newProvider)
            const _api = await ApiPromise.create({ provider: newProvider });
            setIsReady(_api._isReady);
            setConnectedApi(_api)
        }
    };

    //State cleaner to be used when changing networks
    const cleanupState = () => {
        setIsReady(false);
        setConnectedApi(null);
        setProvider(null)
        setNetwork(null)
        setConnectionType(null)
    }

    return (
        <ApiContext.Provider value={{api, selectNetwork, isReady, network}}>
            { children }
        </ApiContext.Provider>
    );
};