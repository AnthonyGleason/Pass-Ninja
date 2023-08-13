import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { VaultController } from '../../Classes/VaultController';
import './DemoLogin.css';
const passwordStrengthFacts = [
  "Incorporating numbers and symbols into your password enhances its security.",
  "Avoid common words and phrases to prevent easily guessable passwords.",
  "Password length matters; aim for at least 12 characters for stronger security.",
  "Randomly generated passwords are generally stronger than personally created ones.",
  "Adding letters numbers, and special characters in unpredictable patterns improves password strength.",
  "Ensure you have enabled two-factor authentication for additional protection against unauthorized access."
];
const getRandomFact = function() {
  return passwordStrengthFacts[Math.floor(Math.random() * passwordStrengthFacts.length)];
};
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
    <div className='demo-login'>
      <p>Creating your secure demo environment...</p>
      <p>This page will automatically refresh when complete.</p>
      <br />
      <p>Tip: {getRandomFact()}</p>
    </div>
  )
}