// //// Open a Crowdloan
// //// Direct Bid on Auction
// //// Unlock Parachain
// //// Swap Leases
// //// Open HRMP Channel
// //// Perform Runtime Upgrade

// //// Register Parathread

// ////// Gives information about the hash of the current Wasm code for a given paraID. Actual Wasm blob can be retrieved by codeByHash().
// const currentCodeHash = async function(paraId) {
//     return await (await api.query.paras.currentCodeHash(paraId)).toHuman()
// }
// ////// Gives information about the current head for a given paraID
// const currentHead = async function(paraId) {
//     return await (await api.query.paras.heads(paraId)).toHuman()
// }
// ////// Gives the entire Wasm blob of a specific hash.
// const codeByHash = async function(hash) {
//     return await (await api.query.paras.codeByHash(hash)).toHuman()
// }
// //// Open a Crowdloan
// ////// Crowdloans Information
// //// Direct Bid on Auction
// ////// Auctions Information

// //// Unlock Parachain
// ////// Info on Paras

// //// Swap Leases
// ////// Gives information of all pending Swaps. This will be an object that matches a paraId that has a pending swap with another paraID
// const pendingSwaps = async function () {
//     const pendingRawInfo = await api.query.registrar.pendingSwap.entries()
//     const allPendingInfo = {}
//     pendingRawInfo.forEach(([{ args: [paraID] }, pendingInfo]) => {
//         const humanParaID = paraID.toHuman();
//         const humanPendingInfo = pendingInfo.toHuman();
//         allPendingInfo[humanParaID] = humanPendingInfo
//     });
//     return allPendingInfo
// }
// //// Open HRMP Channel
// ////// Gives information of all open HRMP channels between two Para's. Object structure {sender:{recipient,channelInfo:{}}}
// const hrmpChannels = async function () {
//     const hrmpRaw = await api.query.hrmp.hrmpChannels.entries()
//     const allHrmp = {}
//     hrmpRaw.forEach(([{ args: [paras] }, channelInfo]) => {
//         const humanParas = paras.toHuman();
//         const humanInfo = channelInfo.toHuman();
//         // console.log(humanParas.sender);
//         // console.log(humanParas.recipient);
//         allHrmp[humanParas.sender] = {
//             "recipient": humanParas.recipient,
//             "channelInfo": humanInfo,
//         };
//     });
//     return allHrmp
// }
// //// Perform Runtime Upgrade
// ////// Gives information about the hash of the future Wasm code for a given paraID. It gives null if no upgrade is planned. Actual Wasm blob can be retrieved by codeByHash().
// const futureCodeHash = async function(paraId) {
//     return await (await api.query.paras.futureCodeHash(paraId)).toHuman()
// }
// ////// Gives information about the block at which an upgrade will be happening. It gives null if no upgrade is planned.
// const futureCodeUpgrades = async function(paraId) {
//     return await (await api.query.paras.futureCodeUpgrades(paraId)).toHuman()
// }
// //// Parachain General Information
// ////// Gives information on all the paraIDs that are connected as parachains
// const parachains = (await api.query.paras.parachains()).toHuman();
// ////// Gives information of the lifecycle (parachain or pathread) of each paraID
// const paraLifecycles = async function () {
//     const paraLCRaw = await api.query.paras.paraLifecycles.entries()
//     const allParaLC = {}
//     paraLCRaw.forEach(([{ args: [paraID] }, status]) => {
//         const humanParaID = paraID.toHuman();
//         const humanStatus = status.toHuman();
//         allParaLC[humanParaID] = humanStatus
//     });
//     return allParaLC
// }