//PARACHAIN INFO
//This component will help export a wasm given a particular hash.

//Dependencies
import {useContext} from 'react';

//Context
import ApiContext from '../../Context/ApiConnect';
import AccountsContext from '../../Context/Accounts';

//API Functions
import { codeByHash } from '../../Api/storage'


const ExportWasm = ({wasmHash}) => {
    //CONTEXT
    const {api, network} = useContext(ApiContext);
    const {userPara} = useContext(AccountsContext);

    const exportWasm = async () => {
        const element = document.createElement("a");
        const wasm = await codeByHash(api, wasmHash);
        const file = new Blob([wasm.data], {type: 'text/plain;charset=utf-8'});
        element.href = URL.createObjectURL(file);
        element.download = `${network}-wasm-paraID-${userPara}.txt`;
        document.body.appendChild(element);
        element.click();
    }


    return (
        <button onClick={exportWasm}>Download Wasm</button>
    );

}


export default ExportWasm;