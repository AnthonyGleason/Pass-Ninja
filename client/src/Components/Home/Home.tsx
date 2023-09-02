import React, { useState } from 'react';
import largeNinjaImg from '../../Assets/public-domain-shinobi-large.png'
import './Home.css';
import { useNavigate } from 'react-router-dom';
import { VaultController } from '../../Classes/VaultController';
import { handleDemoLogin } from '../../Helpers/Auth';
import DemoLogin from '../DemoLogin/DemoLogin';
import downArrowFill from '../../Assets/down-arrow-fill.svg';
import HomeLoginButtons from '../HomeLoginButtons/HomeLoginButtons';
import PasswordGenerator from '../PasswordGenerator/PasswordGenerator';
import Tooltip from '../Tooltip/Tooltip';

export default function Home({vaultController}:{vaultController:VaultController}) {
  const navigate = useNavigate();
  const [isLoading,setIsLoading] = useState<boolean>(false);
  if (!isLoading){
    return (
      <main className="home">
        <section className='home-greeting'>
          <h1>Welcome to PassNinja</h1>
          <img src={largeNinjaImg} alt='Cartoon ninja holding a sword' />
          <h3>Master the Art of Password Security For Free Today!</h3>
          <HomeLoginButtons 
            navigate={navigate}
            handleDemoLogin={handleDemoLogin}
            setIsLoading={setIsLoading}
            vaultController={vaultController}
          />
          <button onClick={()=>{document.querySelector('#info')?.scrollIntoView({behavior: 'smooth'})}}>
            <img src={downArrowFill} alt='scroll to continue' />
          </button>
        </section>
        <section id='info' className='home-info'>
          <p>
            <span>Tired of complicated password managers?</span>
            <br />
            <span>PassNinja features the latest two-factor authentication technology and cutting edge password generation technology designed to keep you in complete control every step of the way.</span>
          </p>
        </section>
        <section className='pass-gen-demo'>
          <PasswordGenerator isExpandedByDefault={true} setPasswordInput={()=>{}} />
        </section>
        <section className='home-call-to-action'>
          <span>Not convinced? Try our live demo below. It is only <b><i>one</i></b> button press away!</span>
          <HomeLoginButtons 
            navigate={navigate}
            handleDemoLogin={handleDemoLogin}
            setIsLoading={setIsLoading}
            vaultController={vaultController}
          />
        </section>
      </main>
    );
  }else{
    return(
      <DemoLogin />
    )
  }
};
