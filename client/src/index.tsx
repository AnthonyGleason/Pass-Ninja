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
import { VaultController } from './Classes/VaultController';
import './index.css';
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const vaultController = new VaultController();
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route element={<Register vaultController={vaultController} />} path='/vault/register' />
        <Route element={<Login />} path='/vault/login' />
        <Route element={<Settings vaultController={vaultController} />} path='/vault/settings' />
        <Route element={<Vault vaultController={vaultController} />} path='/vault'/>
        <Route element={<Home />} path='/' />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
