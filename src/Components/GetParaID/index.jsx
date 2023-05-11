//Get a ParaID
//This component will help a user get a ParaID.

//Dependencies
import {useContext} from 'react';

//Context
import ApiContext from '../../Context/ApiConnect';
import AccountsContext from '../../Context/Accounts';

//API Functions
import { reserveID } from '../../Api/submission'


const GetParaID = () => {
    //CONTEXT
    const { api } = useContext(ApiContext);
    const { userAccount } = useContext(AccountsContext);

    const getParaID = async () => {
        //TODO: Bring status to front end
        await reserveID(api, userAccount)
    }


    return (
        <button onClick={getParaID}>Reserve ParaID</button>
    );

}


export default GetParaID;