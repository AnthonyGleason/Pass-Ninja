import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import PasswordGenerator from '../PasswordGenerator/PasswordGenerator';
import './Register.css';
import { VaultController } from '../../Classes/VaultController';
import { handleDemoLogin } from '../../Helpers/Auth';
import DemoLogin from '../DemoLogin/DemoLogin';

export default function Register({vaultController}:{vaultController:VaultController}){
  const [firstNameInput,setFirstNameInput] = useState<string>('');
  const [lastNameInput,setLastNameInput] = useState<string>('');
  const [emailInput,setEmailInput] = useState<string>('');
  const [masterPasswordInput,setMasterPasswordInput] = useState<string>('');
  const [masterPasswordConfirmInput, setMasterPasswordConfirmInput] = useState<string>('');
  const [isLoading,setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  
  const register = async function ():Promise<string>{
    const response = await fetch('http://localhost:5000/v1/api/vaults/register',{
      method: 'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName: firstNameInput,
        lastName: lastNameInput,
        email: emailInput,
        masterPassword: masterPasswordInput,
        masterPasswordConfirm: masterPasswordConfirmInput
      }),
    });
    const responseData = await response.json();
    return responseData.token;
  }
  const handleSubmit = async function(){
    //register new user
    const token:string = await register();
    localStorage.setItem('jwt',token);
    //redirect user to their vault
    navigate('/vault');
  };

  if (!isLoading){
    return(
      <section className='register'>
        <h3>Register</h3>
        <form className='register-form'>
          <div className='reg-input'>
            <label>First Name:</label>
            <input type='text' value={firstNameInput} onChange={(e)=>{setFirstNameInput(e.target.value)}} />
          </div>
          <div className='reg-input'>
            <label>Last Name:</label>
            <input type='text' value={lastNameInput} onChange={(e)=>{setLastNameInput(e.target.value)}} />
          </div>
          <div className='reg-input'>
            <label>Email:</label>
            <input type='email' value={emailInput} onChange={(e)=>{setEmailInput(e.target.value)}} />
          </div>
          <div className='reg-input'>
            <label>Master Password:</label>
            <input type='password' value={masterPasswordInput} onChange={(e)=>{setMasterPasswordInput(e.target.value)}} />
          </div>
          <div className='reg-input'>
            <label>Master Password (again):</label>
            <input type='password' value={masterPasswordConfirmInput} onChange={(e)=>{setMasterPasswordConfirmInput(e.target.value)}} />
          </div>
          <ul className='register-button-container'>
            <li>
              <button type='button' onClick={()=>{handleSubmit()}}>Submit</button>
            </li>
            <li>
              <button type='button' onClick={()=>{navigate('/vault/login')}}>Login</button>
            </li>
            <li>
              <button type='button' onClick={()=>{handleDemoLogin(vaultController,navigate,setIsLoading)}}>Try the Demo</button>
            </li>
          </ul>
        </form>
        <PasswordGenerator isExpandedByDefault={false} setPasswordInput={setMasterPasswordInput} />
      </section>
    );
  }else{ //display demo login loading display
    return(
      <DemoLogin />
    );
  }
}