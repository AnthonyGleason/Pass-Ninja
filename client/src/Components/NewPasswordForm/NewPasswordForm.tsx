import React, {useState} from 'react';
import { Vault } from '../../Classes/Vault';

export default function NewPasswordForm({
    vault,
    passwordInput,
    setPasswordInput,
    setPasswords
  }:{
    vault:Vault,
    passwordInput:string,
    setPasswordInput:Function,
    setPasswords:Function
  }){
  const [nickNameInput,setNickNameInput] = useState<string>('');
  const [siteUrlInput, setSiteUrlInput] = useState<string>('https://www.');
  const [userNameInput, setUserNameInput] = useState<string>('');
  const handleCreateNewPassword = async function(){
    //store the password inputs in the vault class
    vault.nickNameInput = nickNameInput;
    vault.siteUrlInput = siteUrlInput;
    vault.userNameInput = userNameInput;
    vault.passwordInput = passwordInput;
    //create the new password
    await vault.createNewPassword();
    //refresh client's password data
    setPasswords(await vault.populatePasswords());
  };
  return(
    <form method='POST' action='http://localhost:5000/api/v1/vaults/passwords'>
      <h3>New Password</h3>
      <div>
        <label>Nickname</label>
        <input value={nickNameInput} onChange={(e)=>{setNickNameInput(e.target.value)}} />
      </div>
      <div>
        <label>Web Address</label>
        <input value={siteUrlInput} onChange={(e)=>{setSiteUrlInput(e.target.value)}} />
      </div>
      <div>
        <label>Username</label>
        <input value={userNameInput} onChange={(e)=>{setUserNameInput(e.target.value)}} />
      </div>
      <div>
        <label>Password</label>
        <input value={passwordInput} onChange={(e)=>{setPasswordInput(e.target.value)}} />
      </div>
      <button type='button' onClick={()=>{handleCreateNewPassword()}}>Create New Password</button>
    </form>
  )
}