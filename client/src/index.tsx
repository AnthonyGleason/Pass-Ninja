import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
//using hash router instead of BrowserRouter because we are deploying on gh-pages which only supports HashRouter
import {HashRouter as Router, Routes, Route} from 'react-router-dom';
//components
import SettingsMenu from './Components/VaultSettings/SettingsMenu/SettingsMenu';
import Home from './Components/Home/Home';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import Vault from './Components/Vault/Vault';
import DemoLogin from './Components/DemoLogin/DemoLogin';
import EmailSetting from './Components/VaultSettings/EmailSetting/EmailSetting';
import PasswordSetting from './Components/VaultSettings/PasswordSetting/PasswordSetting';
import TwoFactorSetting from './Components/VaultSettings/TwoFactorSetting/TwoFactorSetting';
//classes
import { VaultController } from './Classes/VaultController';
//import global css styling
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const vaultController = new VaultController();
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        {/* public routes */}
        <Route element={<Home vaultController={vaultController} />} path='/' />
        {/* login */}
        <Route element={<Login vaultController={vaultController} />} path='/vault/login' />
          <Route element={<DemoLogin />} path='/vault/login/demo' />
        {/* register */}
        <Route element={<Register vaultController={vaultController} />} path='/vault/register' />
        {/* authenticated routes */}
        <Route element={<Vault vaultController={vaultController} />} path='/vault'/>
          {/* settings routes */}
          <Route element={<SettingsMenu vaultController={vaultController} />} path='/vault/settings' />
            <Route element={<EmailSetting vaultController={vaultController} />} path='/vault/settings/email' />
            <Route element={<PasswordSetting vaultController={vaultController} />} path='/vault/settings/password' />
            <Route element={<TwoFactorSetting vaultController={vaultController} />} path='/vault/settings/twoFactor' />
      </Routes>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
