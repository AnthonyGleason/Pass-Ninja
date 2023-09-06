import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LogoutPopup.css';

export default function LogoutPopup(){
  const navigate = useNavigate();

  return(
    <section className='logged-out'>
      <p>For security reasons you have been automatically logged out. Please sign in again to access your vault.</p>
      <ul>
        <li>
          <button onClick={()=>{navigate('/vault/login')}} type='button'>Login</button>
        </li>
        <li>
          <button onClick={()=>{navigate('/')}} type='button'>Home</button>
        </li>
      </ul>
    </section>
  )
}