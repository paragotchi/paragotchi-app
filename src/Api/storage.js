/* *** STORAGE ENTRIES *** */

//// get paraID
////// Gives information of what’s the next free paraID.
export const nextFreeParaID = async (api) => {
    return (await api.query.registrar.nextFreeParaId()).toNumber()
} 

////// Gives information on what account is the manager of the Para, what’s the deposit of it, and whether the parachain is locked or not. Needs to be parsed entry by entry.
////// It shows all paras, wether they are parachains or parathreads.
export const paras = async (api) => {
    const parasRawInfo = await api.query.registrar.paras.entries()
    const allParasInfo = [];
    parasRawInfo.forEach(([{ args: [paraID] }, paraInfo]) => {
        const humanParaID = paraID.toHuman();
        const humanparaInfo = paraInfo.toHuman();
        const para = {
            paraID: humanParaID,
            paraInfo: humanparaInfo
        }
        allParasInfo.push(para)
    });
    return allParasInfo
}

//// Register Parathread

////// Gives information about the hash of the current Wasm code for a given paraID. Actual Wasm blob can be retrieved by codeByHash().
export const currentCodeHash = async (api, paraId) => {
    return await (await api.query.paras.currentCodeHash(paraId)).toHuman()
}

// TODO: refactor this to simplify app.
// export const currentCodeHashSub = (api, paraId) => {
//     console.log("being called")
//     return api.query.paras.heads(paraId, (newHead) => {
//         return (newHead.toHuman());
//     })
// }
////// Gives information about the current head for a given paraID
export const currentHead = async (api, paraId) => {
    return await (await api.query.paras.heads(paraId)).toHuman()
}
////// Gives the entire Wasm blob of a specific hash.
export const codeByHash = async (api, hash) => {
    return await (await api.query.paras.codeByHash(hash)).toHuman()
}

//// Open a Crowdloan
////// Crowdloans Information
//// Direct Bid on Auction
////// Auctions Information