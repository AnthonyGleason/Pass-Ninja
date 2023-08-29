import React, { useState } from 'react';
import largeNinjaImg from '../../Assets/public-domain-shinobi-large.png'
import './Home.css';
import { useNavigate } from 'react-router-dom';
import { VaultController } from '../../Classes/VaultController';
import { handleDemoLogin } from '../../Helpers/Auth';
import DemoLogin from '../DemoLogin/DemoLogin';

export default function Home({vaultController}:{vaultController:VaultController}) {
  const navigate = useNavigate();
  const [isLoading,setIsLoading] = useState<boolean>(false);

  if (!isLoading){
    return (
      <main className="home">
        <h2>Welcome to PassNinja</h2>
        <img src={largeNinjaImg} alt='Cartoon ninja holding a sword' />
        <h3>Master the Art of Password Security For Free Today!</h3>
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
      </main>
    );
  }else{
    return(
      <DemoLogin />
    )
  }
};
