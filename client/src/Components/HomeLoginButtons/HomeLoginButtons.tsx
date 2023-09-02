import React from 'react';
import { VaultController } from '../../Classes/VaultController';

export default function HomeLoginButtons({
  navigate,
  handleDemoLogin,
  setIsLoading,
  vaultController
}:{
  navigate:Function,
  handleDemoLogin:Function,
  setIsLoading:Function,
  vaultController:VaultController
}){
  return(
    <ul className='login-button-wrapper'>
      <li>
        <button type='button' onClick={() => { navigate('/vault/register') }}>Register</button>
      </li>
      <li>
        <button type='button' onClick={()=>{ handleDemoLogin(vaultController,navigate,setIsLoading) }}>Try the Demo</button>
      </li>
      <li>
        <button type='button' onClick={() => { navigate('/vault/login') }}>Login</button>
      </li>
    </ul>
  );
}