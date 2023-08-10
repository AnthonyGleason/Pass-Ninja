import React from 'react';
import largeNinjaImg from '../../Assets/public-domain-shinobi-large.png'
import './Home.css';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      <h2>Welcome to PassNinja</h2>
      <img src={largeNinjaImg} alt='cartoon ninja holding sword' />
      <h3>Master the Art of Password Security For Free Today!</h3>
      <div className='login-button-container'>
        <button type='button' onClick={()=>{navigate('/vault/login')}}>Login</button>
        <button type='button' onClick={()=>{navigate('/vault/demologin')}}>Try the Demo</button>
        <button type='button' onClick={()=>{navigate('/vault/register')}}>Register</button>
      </div>
    </div>
  );
};
