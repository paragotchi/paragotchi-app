/* *** CONSTANTS *** */

//// get paraID
////// Gives information to a user of what are the needed tokens to be deposited to get a paraID. Number in 

export const paraDeposit = async (api) => {
    try{
        const data = await api.consts.registrar.paraDeposit.toNumber()
        return ({status:"success", data})
    } catch (error) {
        return ({status:"error", data: error})
    }
}

//// Register Parathread
////// Gives information on how much tokens the user needs to lock given the weight of the submitted artifacts

export const dataDepositPerByte = async (api) => {
    try {
        const data = await api.consts.registrar.dataDepositPerByte.toNumber()
        return ({status:"success", data})
    } catch (error) {
        return ({status:"error", data: error})
    }
}

//// Lease Related

////// Gives information on the offset to start counting for a LP
////// LP = (Block# - leaseOffset) / LeasePeriodDuration
export const leaseOffsetBlocks = async (api) => {
    try {
        const data = await api.consts.slots.leaseOffset.toNumber()
        return ({status:"success", data})
    } catch (error) {
        return ({status:"error", data: error})
    }
}

///// Duration of a lease period in blocks.
export const leasePeriodDuration = async (api) => {
    try {
        const data = await api.consts.slots.leasePeriod.toNumber()
        return ({status:"success", data})
    } catch (error) {
        return ({status:"error", data: error})
    }
}

///// Duration of the ending period of an auction
export const durationEndingPeriod = async (api) => {
    try {
        const data = await api.consts.auctions.endingPeriod.toNumber();
        return ({status:"success", data})
    } catch (error) {
        return ({status:"error", data: error})
    }
}

///// Genesis Hash
export const gensisHash = async (api) => {
    try {
        const data = (await api.genesisHash).toHuman()
        return ({status:"success", data})
    } catch (error) {
        return ({status:"error", data: error})
    }
}

