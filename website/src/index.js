import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import * as serviceWorker from './common/serviceWorker';

import _service from '@netuno/service-client';

import Cluar from './common/Cluar';

import config from './config/config.json';

import './styles/index.less';

_service.config({
    prefix: config.services.api
});

const CluarDataScript = document.createElement("script");
CluarDataScript.src = `/cluarData.js?time=${new Date().getTime()}`;
CluarDataScript.onload = ()=>{
    Cluar.init();
    ReactDOM.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>,
        document.getElementById('root')
    );
    // If you want your app to work offline and load faster, you can change
    // unregister() to register() below. Note this comes with some pitfalls.
    // Learn more about service workers: https://bit.ly/CRA-PWA
    serviceWorker.unregister();
};
document.body.appendChild(CluarDataScript);
