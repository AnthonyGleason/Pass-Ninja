import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { VaultController } from '../../Classes/VaultController';
import './Login.css';

export default function Login({vaultController}:{vaultController:VaultController}){
  const [emailInput,setEmailInput] = useState('');
  const [masterPasswordInput,setMasterPasswordInput] = useState('');
  const navigate = useNavigate();

  const login = async function():Promise<string>{
    const response = await fetch('http://localhost:5000/v1/api/vaults/login',{
      method: 'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: emailInput,
        masterPassword: masterPasswordInput
      }),
    });
    const responseData = await response.json();
    const token:string = responseData.token;
    return token;
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
    }
  };

  return(
    <div className='login'>
      <form>
        <h3>Login</h3>
        <div>
          <label>Email</label>
          <input type='email' value={emailInput} onChange={(e)=>{setEmailInput(e.target.value)}} />
        </div>
        <div>
          <label>Password</label>
          <input type='password' value={masterPasswordInput} onChange={(e)=>{setMasterPasswordInput(e.target.value)}} />
        </div>
        <div>
          <button type='button' onClick={()=>{handleSubmit()}}>Log In</button>
          <button type='button' onClick={()=>{navigate('/vault/register')}}>Register</button>
          <button type='button' onClick={()=>{navigate('/vault/demologin')}}>Try the Demo</button>
        </div>
      </form>
    </div>
  )
};