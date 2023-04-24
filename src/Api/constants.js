/* *** CONSTANTS *** */

//// get paraID
////// Gives information to a user of what are the needed tokens to be deposited to get a paraID. Number in 

export const paraDeposit = async (api) => {
    return await api.consts.registrar.paraDeposit.toNumber()
}

//// Register Parathread
////// Gives information on how much tokens the user needs to lock given the weight of the submitted artifacts

export const dataDepositPerByte = async (api) => {
    return await api.consts.registrar.dataDepositPerByte.toNumber()
}