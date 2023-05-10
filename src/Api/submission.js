/* *** CHAIN SUBMISSIONS *** */

//// get paraID
export const reserveID = async (api) => {
    let data;
    try {
        const info = await api.tx.registrar.reserve().paymentInfo("5HTXphPwMDzrtJ4MFxk7wYYLgW6ceN5DMwRcXEi7iLfd5eWC") 
        console.log(info.partialFee.toHuman());
        // data = (await api.tx.registrar.reserve())
        // console.log(data)
        return ({status:"success", data})
    } catch (error) {
        return ({status:"error", data: error})
    }
}