import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
//components
import Settings from './Components/Settings/Settings';
import Home from './Components/Home/Home';
import Login from './Components/Login/Login';
import Nav from './Components/Nav/Nav';
import Register from './Components/Register/Register';
import Vault from './Components/Vault/Vault';
//classes
import { VaultBrowser } from './Classes/VaultBrowser';

import './index.css';
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const vaultBrowser = new VaultBrowser();
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route element={<Register vaultBrowser={vaultBrowser} />} path='/vault/register' />
        <Route element={<Login vaultBrowser={vaultBrowser} />} path='/vault/login' />
        <Route element={<Settings vaultBrowser={vaultBrowser} />} path='/vault/settings' />
        <Route element={<Vault vaultBrowser={vaultBrowser} />} path='/vault'/>
        <Route element={<Home />} path='/' />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
