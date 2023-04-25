/* *** STORAGE ENTRIES *** */

//// get paraID

////// Gives information of what’s the next free paraID.
export const nextFreeParaID = async (api) => {
    let data;
    try {
        data = (await api.query.registrar.nextFreeParaId()).toNumber()
        return ({status:"success", data})
    } catch (error) {
        return ({status:"error", data: error})
    }
}

////// Gives information on what account is the manager of the Para, what’s the deposit of it, and whether the parachain is locked or not. Needs to be parsed entry by entry.
////// It shows all paras, wether they are parachains or parathreads.
export const paras = async (api) => {
    try {
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
        // return allParasInfo
        return ({status:"success", data: allParasInfo})
    } catch (error) {
        return ({status:"error", data: error})
    }
}

//// Register Parathread

////// Gives information about the hash of the current Wasm code for a given paraID. Actual Wasm blob can be retrieved by codeByHash().
export const currentCodeHash = async (api, paraId) => {
    let data;
    try {
        data = await (await api.query.paras.currentCodeHash(paraId)).toHuman()
        return ({status:"success", data})
    } catch (error) {
        return ({status:"error", data: error})
    }
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
    let data;
    try {
        data = await (await api.query.paras.heads(paraId)).toHuman()
        return ({status:"success", data})
    } catch (error) {
        return ({status:"error", data: error})
    }
}
////// Gives the entire Wasm blob of a specific hash.
export const codeByHash = async (api, hash) => {
    let data;
    try {
        data = await (await api.query.paras.codeByHash(hash)).toHuman();
        return ({status:"success", data})
    } catch (error) {
        return ({status:"error", data: error})
    }
}

//// Open a Crowdloan
////// Crowdloans Information
//// Direct Bid on Auction
////// Auctions Information

// ////// Info on Paras

//// Swap Leases
////// Gives information of all pending Swaps. This will be an object that matches a paraId that has a pending swap with another paraID
export const pendingSwaps = async (api) => {
    try {
        const pendingRawInfo = await api.query.registrar.pendingSwap.entries()
        const allPendingInfo = {}
        pendingRawInfo.forEach(([{ args: [paraID] }, pendingInfo]) => {
            const humanParaID = paraID.toHuman();
            const humanPendingInfo = pendingInfo.toHuman();
            allPendingInfo[humanParaID] = humanPendingInfo
        });
        // return allPendingInfo
        return ({status:"success", data: allPendingInfo})
    } catch (error) {
        return ({status:"error", data: error}) 
    }
}
//// Open HRMP Channel
////// Gives information of all open HRMP channels between two Para's. Object structure {sender:{recipient,channelInfo:{}}}
export const hrmpChannels = async (api) => {
    try {
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
        // return allHrmp
        return ({status:"success", data: allHrmp})
    } catch (error) {
        return ({status:"error", data: error})
    }
}
//// Perform Runtime Upgrade
////// Gives information about the hash of the future Wasm code for a given paraID. It gives null if no upgrade is planned. Actual Wasm blob can be retrieved by codeByHash().
export const futureCodeHash = async(api, paraId) => {
    let data;
    try {
        data = await (await api.query.paras.futureCodeHash(paraId)).toHuman()
        return ({status:"success", data})
    } catch (error) {
        return ({status:"error", data: error})
    }
}
////// Gives information about the block at which an upgrade will be happening. It gives null if no upgrade is planned.
export const futureCodeUpgrades = async(api, paraId) => {
    let data;
    try {
        data = await (await api.query.paras.futureCodeUpgrades(paraId)).toHuman()
        return ({status:"success", data})
    } catch (error) {
        return ({status:"error", data: error})
    }
}
//// Parachain General Information
////// Gives information on all the paraIDs that are connected as parachains
export const parachains = async (api) => {
    let data;
    try {
        data = (await api.query.paras.parachains()).toHuman()
        return ({status:"success", data})
    } catch (error) {
        return ({status:"error", data:error})
    }
};
////// Gives information of the lifecycle (parachain or pathread) of each paraID
export const paraLifecycles = async (api) => {
    try {
        const paraLCRaw = await api.query.paras.paraLifecycles.entries()
        const allParaLC = {}
        paraLCRaw.forEach(([{ args: [paraID] }, status]) => {
            const humanParaID = paraID.toHuman();
            const humanStatus = status.toHuman();
            allParaLC[humanParaID] = humanStatus
        });
        // return allParaLC
        return ({status:"success", data: allParaLC})
    } catch (error) {
        return ({status:"error", data: error})
    }
}

export const parasFullDetails = async (api) => {
    // //array with all paraIDs of Parachains
    // const _parachains = await parachains(api);
    //object that has paraID as key, and lifecycle as value
    const _paraLifecycles = await paraLifecycles(api)
    // array with objects that have paraID and parachain info
    const _paras = await paras(api)

    if (_paraLifecycles.status === "error") {
        return ({status:"error", data: _paraLifecycles.data})
    } else if (_paras.status === "error") {
        return ({status:"error", data: _paras.data})
    }

    const data = _paras.data.map(para => {
        return {...para, stage:_paraLifecycles.data[para.paraID]}
    })

    return ({status:"success", data})
}

////// Gives information on all the slots on for all paraIDs
export const slots = async (api) => {
    try {
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
        // return parsedSlots
        return ({status:"success", data: parsedSlots})
    } catch (error) {
        return ({status:"error", data: error})
    }
}