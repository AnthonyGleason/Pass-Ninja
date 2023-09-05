import React, { useEffect, useState } from 'react';
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
//aos (animate on scroll library)
import Aos from 'aos';
import "aos/dist/aos.css";

export default function Home({vaultController}:{vaultController:VaultController}) {
  const navigate = useNavigate();
  const [isLoading,setIsLoading] = useState<boolean>(false);
  useEffect(()=>{
    Aos.init({duration: 2000});
  },[]);

  if (!isLoading){
    return (
      <main className="home">
        <section data-aos='fade-in' className='home-greeting'>
          <img src={largeNinjaImg} alt='Cartoon ninja holding a sword' />
          <h3>Master the Art of Password Security For Free Today!</h3>
          <ul className='login-button-wrapper'>
            <li>
              <button type='button' onClick={() => { navigate('/vault/register') }}>Register</button>
            </li>
            <li>
              <button type='button' onClick={()=>{ handleDemoLogin(vaultController,navigate,setIsLoading) }}>Try the Demo</button>
            </li>
            <li>
              <button type='button' onClick={() => { navigate('/vault/login') }}>Login</button>
            </li>
          </ul>
          <button className='down-arrow' onClick={()=>{document.querySelector('#info')?.scrollIntoView({behavior: 'smooth'})}}>
            <img src={downArrowFill} alt='scroll to continue' />
          </button>
        </section>
        <section id='info' className='home-info'>
          <p>
            <span className='info-block-one' data-aos='fade-right'>Ready to enhance your digital security?</span>
            <br />
            <span className='info-block-two' data-aos='fade-right'>Tired of complicated password managers?</span>
            <br />
            <span className='info-block-three' data-aos='fade-right'>Pass Ninja features the latest two-factor authentication technology and cutting edge password generation technology designed to keep you in complete control every step of the way.</span>
          </p>
        </section>
        <section className='pass-gen-demo'>
          <PasswordGenerator isExpandedByDefault={true} />
        </section>
        <section className='home-call-to-action'>
          <p>
            <span>Not convinced?</span>
            <br />
            Try our live demo. It is only <b><i>one</i></b> button press away!
          </p>
          <ul className='login-button-wrapper'>
            <li>
              <button type='button' onClick={()=>{ handleDemoLogin(vaultController,navigate,setIsLoading) }}>Try the Demo</button>
            </li>
          </ul>
        </section>
      </main>
    );
  }else{
    return(
      <DemoLogin />
    )
  }
};
