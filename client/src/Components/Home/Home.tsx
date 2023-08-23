import React from 'react';
import largeNinjaImg from '../../Assets/public-domain-shinobi-large.png'
import './Home.css';
import { useNavigate } from 'react-router-dom';
import { VaultController } from '../../Classes/VaultController';

export default function Home({vaultController}:{vaultController:VaultController}) {
  const navigate = useNavigate();

  const handleDemoLogin= async function(){
    const response = await fetch('http://localhost:5000/v1/api/vaults/demologin',{
      method: 'GET',
    });
    const responseData = await response.json();
    const token:string = responseData.token;
    if (token){
      //ensure master password is not set so user can not update the demo account
      vaultController.masterPassword = 'demopass';
      //set token in local storage
      localStorage.setItem('jwt',token);
      //redirect the user to the demo vault
      navigate('/vault');
    };
  };

  return (
    <div className="home">
      <h2>Welcome to PassNinja</h2>
      <img src={largeNinjaImg} alt='cartoon ninja holding sword' />
      <h3>Master the Art of Password Security For Free Today!</h3>
      <div className='login-button-container'>
        <button type='button' onClick={()=>{navigate('/vault/login')}}>Login</button>
        <button type='button' onClick={()=>{handleDemoLogin()}}>Try the Demo</button>
        <button type='button' onClick={()=>{navigate('/vault/register')}}>Register</button>
      </div>
    </div>
  );
};
