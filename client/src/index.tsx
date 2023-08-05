import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './Components/App/App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import VaultComponent from './Components/Vault/Vault';
import { VaultBrowser } from './Classes/VaultBrowser';
import AccountSettings from './Components/AccountSettings/AccountSettings';
import ninjaLogo from './Assets/publicdomainq-ninja-shinobi.svg';
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const vaultBrowser = new VaultBrowser();
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <div>
      {/* This is temporary, will be changed to useNaviagate in a proper nav component */}
      <h2 onClick={()=>{window.location.href='/'}}>PassNinja</h2>
    </div>
      <Routes>
        <Route element={<App />} path='/' />
        <Route element={<Login vaultBrowser={vaultBrowser} />} path='/login' />
        <Route element={<Register vaultBrowser={vaultBrowser} />} path='/register' />
        <Route element={<AccountSettings vaultBrowser={vaultBrowser} />} path='/vault/settings' />
        <Route element={<VaultComponent vaultBrowser={vaultBrowser} />} path='/vault'/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
