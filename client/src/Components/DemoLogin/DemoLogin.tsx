import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { VaultController } from '../../Classes/VaultController';

export default function DemoLogin({vaultController}:{vaultController:VaultController}){
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

  //handle initial page load
  useEffect(()=>{
    handleDemoLogin();
  },[])

  return(
    <div>
      <p>Creating your secure demo enviornment...</p>
      <p>This page will automatically refresh when complete.</p>
    </div>
  )
}