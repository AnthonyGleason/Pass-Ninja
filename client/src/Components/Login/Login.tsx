import React, {useState} from 'react';
import { Vault } from '../../Classes/Vault';
import { useNavigate } from 'react-router-dom';

export default function Login({vault}:{vault:Vault}){
  const navigate = useNavigate();
  const [emailInput,setEmailInput] = useState<string>();
  const [masterPasswordInput,setMasterPasswordInput] = useState<string>();
  const handleSubmit = async function(){
    const response = await fetch('http://localhost:5000/v1/api/vaults/login',{
      method: 'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: emailInput,
        password: masterPasswordInput,
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
          <input type='email' onChange={(e)=>{setEmailInput(e.target.value)}} />
        </div>
        <div>
          <label>Password</label>
          <input type='password' onChange={(e)=>{setMasterPasswordInput(e.target.value)}} />
        </div>
        <button type='button' onClick={()=>{handleSubmit()}}>Submit</button>
      </form>
    </div>
  )
}