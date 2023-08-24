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
      <div className="home">
        <h2>Welcome to PassNinja</h2>
        <img src={largeNinjaImg} alt='cartoon ninja holding sword' />
        <h3>Master the Art of Password Security For Free Today!</h3>
        <div className='login-button-container'>
          <button type='button' onClick={()=>{navigate('/vault/login')}}>Login</button>
          <button type='button' onClick={()=>{handleDemoLogin(vaultController,navigate,setIsLoading)}}>Try the Demo</button>
          <button type='button' onClick={()=>{navigate('/vault/register')}}>Register</button>
        </div>
      </div>
    );
  }else{
    return(
      <DemoLogin />
    )
  }
};
