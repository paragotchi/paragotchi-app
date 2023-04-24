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

// ////// Info on Paras

//// Swap Leases
////// Gives information of all pending Swaps. This will be an object that matches a paraId that has a pending swap with another paraID
export const pendingSwaps = async (api) => { 
    const pendingRawInfo = await api.query.registrar.pendingSwap.entries()
    const allPendingInfo = {}
    pendingRawInfo.forEach(([{ args: [paraID] }, pendingInfo]) => {
        const humanParaID = paraID.toHuman();
        const humanPendingInfo = pendingInfo.toHuman();
        allPendingInfo[humanParaID] = humanPendingInfo
    });
    return allPendingInfo
}
//// Open HRMP Channel
////// Gives information of all open HRMP channels between two Para's. Object structure {sender:{recipient,channelInfo:{}}}
export const hrmpChannels = async (api) => {
    const hrmpRaw = await api.query.hrmp.hrmpChannels.entries()
    const allHrmp = [];
    hrmpRaw.forEach(([{ args: [paras] }, channelInfo]) => {
        const humanParas = paras.toHuman();
        const humanInfo = channelInfo.toHuman();
        const channel = {
            "sender": humanParas.sender,
            "recipient": humanParas.recipient,
            "channelInfo": humanInfo,
        }
        allHrmp.push(channel)
    });
    return allHrmp
}
//// Perform Runtime Upgrade
////// Gives information about the hash of the future Wasm code for a given paraID. It gives null if no upgrade is planned. Actual Wasm blob can be retrieved by codeByHash().
export const futureCodeHash = async(api, paraId) => {
    return await (await api.query.paras.futureCodeHash(paraId)).toHuman()
}
////// Gives information about the block at which an upgrade will be happening. It gives null if no upgrade is planned.
export const futureCodeUpgrades = async(api, paraId) => {
    return await (await api.query.paras.futureCodeUpgrades(paraId)).toHuman()
}
//// Parachain General Information
////// Gives information on all the paraIDs that are connected as parachains
export const parachains = async (api) => {
    return (await api.query.paras.parachains()).toHuman()
};
////// Gives information of the lifecycle (parachain or pathread) of each paraID
export const paraLifecycles = async (api) => { 
    const paraLCRaw = await api.query.paras.paraLifecycles.entries()
    const allParaLC = {}
    paraLCRaw.forEach(([{ args: [paraID] }, status]) => {
        const humanParaID = paraID.toHuman();
        const humanStatus = status.toHuman();
        allParaLC[humanParaID] = humanStatus
    });
    return allParaLC
}

export const parasFullDetails = async (api) => {
    // //array with all paraIDs of Parachains
    // const _parachains = await parachains(api);
    //object that has paraID as key, and lifecycle as value
    const _paraLifecycles = await paraLifecycles(api)
    console.log(_paraLifecycles)
    // array with objects that have paraID and parachain info
    const _paras = await paras(api)

    return _paras.map(para => {
        return {...para, stage:_paraLifecycles[para.paraID]}
    })
}

////// Gives information on all the slots on for all paraIDs
export const slots = async (api) => {
    const allSlots = await api.query.slots.leases.entries()
    const parsedSlots = [];
    allSlots.forEach(([{ args: [paraID] }, status]) => {
        const humanParaID = paraID.toHuman();
        const humanStatus = status.toHuman();
        const slotsObj = {
            paraID: humanParaID,
            remainingSlots: humanStatus.length
        }
        parsedSlots.push(slotsObj)
    });
    return parsedSlots
}