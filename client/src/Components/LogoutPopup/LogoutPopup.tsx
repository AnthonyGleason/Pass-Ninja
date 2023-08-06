import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LogoutPopup(){
  const navigate = useNavigate();

  const handleConfirmPopup = function(){
    navigate('/vault/login');
  }
  return(
    <div>
      <p>For security reasons you have been automatically logged out. Please sign in again to access your vault.</p>
      <button onClick={()=>{handleConfirmPopup()}} type='button'>Take me there</button>
    </div>
  )
}