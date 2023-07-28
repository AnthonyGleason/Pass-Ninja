import React, {useState} from 'react';
import { VaultBrowser } from '../../Classes/VaultBrowser';
import { useNavigate } from 'react-router-dom';

export default function Login({vaultBrowser}:{vaultBrowser:VaultBrowser}){
  const [emailInput,setEmailInput] = useState(vaultBrowser.inputFields.emailInput);
  const [masterPasswordInput,setMasterPasswordInput] = useState(vaultBrowser.inputFields.masterPasswordInput);
  const navigate = useNavigate();
  const handleSubmit = async function(){
    //login user
    const token:string = await vaultBrowser.login();
    //set token in local storage
    localStorage.setItem('jwt',token);
    //redirect the user to their vault
    navigate('/vault');
  };
  const handleEmailInputChange = function(updatedVal:string){
    setEmailInput(updatedVal);
    vaultBrowser.inputFields.emailInput=updatedVal;
  };
  const handleMasterPasswordInputChange = function(updatedVal:string){
    setMasterPasswordInput(updatedVal);
    vaultBrowser.inputFields.masterPasswordInput=updatedVal;
  };
  return(
    <div className='login'>
      <form>
        <div>
          <label>Email</label>
          <input type='email' value={emailInput} onChange={(e)=>{handleEmailInputChange(e.target.value)}} />
        </div>
        <div>
          <label>Password</label>
          <input type='password' value={masterPasswordInput} onChange={(e)=>{handleMasterPasswordInputChange(e.target.value)}} />
        </div>
        <button type='button' onClick={()=>{handleSubmit()}}>Submit</button>
      </form>
    </div>
  )
}