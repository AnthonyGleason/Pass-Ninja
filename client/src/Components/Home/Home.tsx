import React from 'react';
import largeNinjaImg from '../../Assets/public-domain-shinobi-large.png'
import './Home.css';
import { useNavigate } from 'react-router-dom';

export default function Home({vaultController}:any) {
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
      <h3 className='scroll'>Welcome to PassNinja</h3>
      <img src={largeNinjaImg} alt='cartoon ninja holding sword' />
      <h4 className='scroll'>Master the Art of Password Security For Free Today!</h4>
      <div className='login-button-container'>
        <button className='scroll' type='button' onClick={()=>{handleDemoLogin()}}>Demo</button>
        <button className='scroll' type='button' onClick={()=>{navigate('/vault/register')}}>Register</button>
        <button className='scroll' type='button' onClick={()=>{navigate('/vault/login')}}>Login</button>
      </div>
    </div>
  );
};
