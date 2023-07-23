import React, {useState} from 'react';
import { decryptPassword } from '../Vault/Vault';
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
    const passwords = responseData.passwords;
    localStorage.setItem('jwt',token);
    //decrypt passwords using password input from above
    if (masterPasswordInput){
      passwords.forEach((password:any)=>{
        if (!password.encryptedPassword || !password.userName) return;
        console.log(password);
        password.decryptedPassword = decryptPassword(password.encryptedPassword,masterPasswordInput);
      });
      //set master password in vault class so the user can perform crud operations on their vault,
      vault.masterPassword=masterPasswordInput;
    };
    //set passwords in vault class
    vault.passwords=passwords;
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