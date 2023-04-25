//Dependencies
import React, { createContext, useState } from 'react';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';

const AccountsContext = createContext();

export default AccountsContext;

export function Accounts ({ children }) {
    const [accounts, setAccounts] = useState([]);
    const [userAccount, setUserAccount] = useState(null);
    const [userPara, setUserPara] = useState(null);

    const connectWallet = async () => {
        const extensions = await web3Enable('Para{chain,thread} Manager App');
        if (extensions.length === 0) {
            //TODO: Do something here, maybe a message?
            return;
        }
        
        const allAccounts = await web3Accounts();
        setAccounts(allAccounts)
    }

    const selectAccount = (acc) => {
        if (accounts.length === 0) {
            //TODO: Do something here, maybe a message?
            return;
        } else {
            setUserAccount(acc)
        }
    }

    const userParaSelection = (paraID) => {
        setUserPara(paraID)
    }

    return (
        <AccountsContext.Provider value={{accounts, userAccount, connectWallet, selectAccount, userPara, userParaSelection}}>
            { children }
        </AccountsContext.Provider>
    );
};