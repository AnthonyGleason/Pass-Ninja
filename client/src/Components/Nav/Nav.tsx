import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Nav.css';
export default function Nav(){
  const navigate = useNavigate();
  return(
    <div className='nav'>
      <ul>
        <li onClick={()=>{navigate('/')}}>Home</li>
        <li>Password Generator</li>
        <li>Login</li>
        <li>Register</li>
      </ul>
    </div>
  )
};