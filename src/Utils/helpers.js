export const blockToNumber = (block) => {
    return Number(block.split(",").join(""));
}

export const calculateTargetDate = (t, b1, b2, avg) => {
    //given the timemstamp and height of b1, and the avg block time production, this function returns the potential timestamp of b2.
    const targetTimestamp = t + ((b2-b1) * avg * 1000);
    return new Date(targetTimestamp)
}