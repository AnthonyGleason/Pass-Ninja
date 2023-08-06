import React from 'react';
import ninjaImg from '../../Assets/285699.png'
import './Home.css';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="Home">
      Welcome to PassNinja<br/>
      <img src={ninjaImg} alt='cartoon ninja holding sword' /><br />
      Secure Your Online Identity Today
      <div>
        <button type='button' onClick={()=>{navigate('/vault/login')}}>Login</button><br />
        <button type='button' onClick={()=>{navigate('/vault/register')}}>Register</button>
      </div>
    </div>
  );
};
