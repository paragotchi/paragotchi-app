/* *** CHAIN SUBMISSIONS *** */
import { web3FromSource } from '@polkadot/extension-dapp';

//// get paraID
export const reserveID = async (api, account) => {
    let data;
    try {
        const injector = await web3FromSource(account.meta.source);

        const tx = api.tx.registrar.reserve(); 

        await tx.signAndSend(account.address, { signer: injector.signer }, ({ status }) => {
            if (status.isInBlock) {
                console.log(`Completed at block hash #${status.asInBlock.toString()}`);
            } else {
                console.log(`Current status: ${status.type}`);
            }
        });
        // const info = await api.tx.registrar.reserve().paymentInfo("5Gmj76wsv4e5obqdZwRSwSjG3JAeQuZwQUKoBxRW8FF5cR9F") 
        return ({status:"success", data})
    } catch (error) {
        return ({status:"error", data: error})
    }
}