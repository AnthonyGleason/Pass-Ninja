import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import PasswordGenerator from '../PasswordGenerator/PasswordGenerator';
import './Register.css';

export default function Register(){
  const [firstNameInput,setFirstNameInput] = useState<string>('');
  const [lastNameInput,setLastNameInput] = useState<string>('');
  const [emailInput,setEmailInput] = useState<string>('');
  const [masterPasswordInput,setMasterPasswordInput] = useState<string>('');
  const [masterPasswordConfirmInput, setMasterPasswordConfirmInput] = useState<string>('');
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

  return(
    <div className='register'>
      <form>
        <h3>Register</h3>
        <div>
          <label>First Name</label>
          <input type='text' value={firstNameInput} onChange={(e)=>{setFirstNameInput(e.target.value)}} />
        </div>
        <div>
          <label>Last Name</label>
          <input type='text' value={lastNameInput} onChange={(e)=>{setLastNameInput(e.target.value)}} />
        </div>
        <div>
          <label>Email</label>
          <input type='email' value={emailInput} onChange={(e)=>{setEmailInput(e.target.value)}} />
        </div>
        <div>
          <label>Master Password</label>
          <input type='password' value={masterPasswordInput} onChange={(e)=>{setMasterPasswordInput(e.target.value)}} />
        </div>
        <div>
          <label>Master Password (again)</label>
          <input type='password' value={masterPasswordConfirmInput} onChange={(e)=>{setMasterPasswordConfirmInput(e.target.value)}} />
        </div>
        <button type='button' onClick={()=>{handleSubmit()}}>Submit</button>
      </form>
      <PasswordGenerator setPasswordInput={setMasterPasswordInput} />
    </div>
  )
}