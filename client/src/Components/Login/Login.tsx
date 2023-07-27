import React, {useState} from 'react';
import { VaultBrowser } from '../../Classes/VaultBrowser';
import { useNavigate } from 'react-router-dom';

export default function Login({vaultBrowser}:{vaultBrowser:VaultBrowser}){
  const [emailInput,setEmailInput] = useState(vaultBrowser.emailInput);
  const [masterPasswordInput,setMasterPasswordInput] = useState(vaultBrowser.masterPasswordInput);

  const navigate = useNavigate();
  const handleSubmit = async function(){
    const response = await fetch('http://localhost:5000/v1/api/vaults/login',{
      method: 'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: vaultBrowser.emailInput,
        pmasterPassword: vaultBrowser.masterPasswordInput,
      }),
    });
    const responseData = await response.json();
    const token = responseData.token;
    localStorage.setItem('jwt',token);
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
}