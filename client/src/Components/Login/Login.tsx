import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { VaultController } from '../../Classes/VaultController';
import './Login.css';
import { handleDemoLogin } from '../../Helpers/Auth';
import DemoLogin from '../DemoLogin/DemoLogin';

export default function Login({vaultController}:{vaultController:VaultController}){
  const [emailInput,setEmailInput] = useState<string>('');
  const [masterPasswordInput,setMasterPasswordInput] = useState<string>('');
  const [isOtpRequired,setIsOtpRequired] = useState<boolean>(false);
  const [otpInput, setOtpInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const login = async function():Promise<string>{
    const response = await fetch('http://localhost:5000/v1/api/vaults/login',{
      method: 'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: emailInput,
        masterPassword: masterPasswordInput,
        userOtpInput: otpInput || ''
      }),
    });
    const responseData = await response.json();
    if (responseData.token){
      const token:string = responseData.token;
      return token;
    }else{
      vaultController.isTwoFactorEnabled = true;
      setIsOtpRequired(true);
      return ''; //return an empty token
    }
  };

  const handleSubmit = async function(){
    //login user
    const token:string = await login();
    if (token){
      //login was successful update masterPassword property of the vaultController class 
      vaultController.masterPassword = masterPasswordInput;
      //set token in local storage
      localStorage.setItem('jwt',token);
      //redirect the user to their vault
      navigate('/vault');
    };
  };

  const getOtpInputElement = function(){
    return isOtpRequired ? (
      <div className='login-input'>
        <label>One Time Password:</label>
        <input value={otpInput} onChange={(e)=>{setOtpInput(e.target.value)}} />
      </div> 
    ):(
      null
    );
  };

  if (!isLoading){
    return(
      <section className='login'>
        <h3>Login</h3>
        <form>
          <div className='login-input'>
            <label>Email:</label>
            <input type='email' value={emailInput} onChange={(e)=>{setEmailInput(e.target.value)}} />
          </div>
          <div className='login-input'>
            <label>Password:</label>
            <input type='password' value={masterPasswordInput} onChange={(e)=>{setMasterPasswordInput(e.target.value)}} />
          </div>
          {
            getOtpInputElement()
          }
          <ul className='login-button-container'>
            <li>
              <button type='button' onClick={()=>{handleSubmit()}}>Submit</button>
            </li>
            <li>
              <button type='button' onClick={()=>{navigate('/vault/register')}}>Register</button>
            </li>
            <li>
              <button type='button' onClick={()=>{handleDemoLogin(vaultController,navigate,setIsLoading)}}>Try the Demo</button>
            </li>
          </ul>
        </form>
      </section>
    )
  }else{
    return(
      <DemoLogin />
    );
  };
};