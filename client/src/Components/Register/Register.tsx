import React, {useState} from 'react';
import { VaultBrowser } from '../../Classes/VaultBrowser';
import { useNavigate } from 'react-router-dom';
import PasswordGenerator from '../PasswordGenerator/PasswordGenerator';

export default function Register({vaultBrowser}:{vaultBrowser:VaultBrowser}){
  const [firstNameInput,setFirstNameInput] = useState<string>('');
  const [lastNameInput,setLastNameInput] = useState<string>('');
  const [emailInput,setEmailInput] = useState<string>('');
  const [masterPasswordInput,setMasterPasswordInput] = useState<string>('');
  const [masterPasswordConfirmInput, setMasterPasswordConfirmInput] = useState<string>('');
  const navigate = useNavigate();
  
  const handleSubmit = async function(){
    //set inputs in vaultBrowser class instance
    vaultBrowser.register.emailInput = emailInput;
    vaultBrowser.register.firstNameInput= firstNameInput;
    vaultBrowser.register.lastNameInput = lastNameInput;
    vaultBrowser.register.masterPasswordInput = masterPasswordInput;
    vaultBrowser.register.masterPasswordConfirmInput = masterPasswordConfirmInput;
    //register new user
    const token:string = await vaultBrowser.register.register();
    localStorage.setItem('jwt',token);
    //redirect user to their vault
    navigate('/vault');
  };

  return(
    <div className='register'>
      <form>
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