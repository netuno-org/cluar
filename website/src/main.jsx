import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import * as serviceWorker from './common/serviceWorker';

import Cluar from './common/Cluar';

import './styles/index.less';

const CluarDataScript = document.createElement("script");
const CluarSettingsScript = document.createElement("script");

CluarSettingsScript.src = `/cluar/settings.js?time=${new Date().getTime()}`;
CluarDataScript.src = `/cluar/data.js?time=${new Date().getTime()}`;

Promise.all([
  new Promise((resolve, reject) => {
    CluarSettingsScript.onload = resolve;
    CluarSettingsScript.onerror = reject;
  }),
  new Promise((resolve, reject) => {
    CluarDataScript.onload = resolve;
    CluarDataScript.onerror = reject;
  }),
]).then(() => {
  Cluar.init();

  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: https://bit.ly/CRA-PWA
  serviceWorker.unregister();
});

document.body.appendChild(CluarSettingsScript);
document.body.appendChild(CluarDataScript);
