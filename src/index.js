import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

//Context
import {ApiConnect} from './Context/ApiConnect'
import {Accounts} from './Context/Accounts'
import {ChainInfo} from './Context/ChainInfo'
import { Parachains } from './Context/Parachains';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ApiConnect>
    <ChainInfo>
      <Parachains>
        <Accounts>
          <App />
        </Accounts>
      </Parachains>
    </ChainInfo>
  </ApiConnect>  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
