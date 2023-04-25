/* *** CONSTANTS *** */

//// get paraID
////// Gives information to a user of what are the needed tokens to be deposited to get a paraID. Number in 

export const paraDeposit = async (api) => {
    let data;
    try{
        data = await api.consts.registrar.paraDeposit.toNumber()
        return ({status:"success", data})
    } catch (error) {
        data = error
        return ({status:"error", data})
    }
}

//// Register Parathread
////// Gives information on how much tokens the user needs to lock given the weight of the submitted artifacts

export const dataDepositPerByte = async (api) => {
    let data;
    try {
        data = await api.consts.registrar.dataDepositPerByte.toNumber()
        return ({status:"success", data})
    } catch (error) {
        return ({status:"error", data})
    }
}

//// Lease Related

////// Gives information on the offset to start counting for a LP
////// LP = (Block# - leaseOffset) / LeasePeriodDuration
export const leaseOffsetBlocks = async (api) => {
    let data;
    try {
        data = await api.consts.slots.leaseOffset.toNumber()
        return ({status:"success", data})
    } catch (error) {
        return ({status:"error", data})
    }
}

///// Duration of a lease period in blocks.
export const leasePeriodDuration = async (api) => {
    let data;
    try {
        data = await api.consts.slots.leasePeriod.toNumber()
        return ({status:"success", data})
    } catch (error) {
        return ({status:"error", data})
    }
}