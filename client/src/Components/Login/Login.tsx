import React, {useState} from 'react';
import { VaultBrowser } from '../../Classes/VaultBrowser';
import { useNavigate } from 'react-router-dom';

export default function Login({vaultBrowser}:{vaultBrowser:VaultBrowser}){
  const [emailInput,setEmailInput] = useState('');
  const [masterPasswordInput,setMasterPasswordInput] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async function(){
    //set inputs in vault browser class instance
    vaultBrowser.login.emailInput = emailInput;
    vaultBrowser.login.masterPasswordInput = masterPasswordInput;
    vaultBrowser.vault.masterPassword = masterPasswordInput;
    //login user
    const token:string = await vaultBrowser.login.login();
    //set token in local storage
    localStorage.setItem('jwt',token);
    //redirect the user to their vault
    navigate('/vault');
  };
  
  return(
    <div className='login'>
      <form>
        <div>
          <label>Email</label>
          <input type='email' value={emailInput} onChange={(e)=>{setEmailInput(e.target.value)}} />
        </div>
        <div>
          <label>Password</label>
          <input type='password' value={masterPasswordInput} onChange={(e)=>{setMasterPasswordInput(e.target.value)}} />
        </div>
        <button type='button' onClick={()=>{handleSubmit()}}>Submit</button>
      </form>
    </div>
  )
};