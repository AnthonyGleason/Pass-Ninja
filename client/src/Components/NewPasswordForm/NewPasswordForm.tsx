import React, {useState} from 'react';
import { VaultController } from '../../Classes/VaultController';
import PasswordGenerator from '../PasswordGenerator/PasswordGenerator';
import './NewPasswordForm.css';

export default function NewPasswordForm({
    vaultController,
    setPasswords
  }:{
    vaultController:VaultController,
    setPasswords:Function
  }){
  const [isMenuExpanded,setIsMenuExpanded] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [nickNameInput,setNickNameInput] = useState<string>('');
  const [siteUrlInput, setSiteUrlInput] = useState<string>('https://www.');
  const [userNameInput, setUserNameInput] = useState<string>('');
  const [notesInput,setNotesInput] = useState<string>('');

  const handleCreateNewPassword = async function(){
    //create the new password
    await vaultController.createNewPassword(passwordInput,nickNameInput,siteUrlInput,userNameInput,notesInput);
    //refresh client's password data
    setPasswords(await vaultController.populatePasswords());
  };

  if (isMenuExpanded){ //if the user has expanded the New Password menu then display the form to create a new password
    return(
      <form className='new-password-form' method='POST' action='http://localhost:5000/api/v1/vaults/passwords'>
        <h3 onClick={()=>{setIsMenuExpanded(false)}}>Create New Password</h3>
        <ul className='input-container'>
          <li className='new-pass-input'>
            <label>Nickname:</label>
            <input value={nickNameInput} onChange={(e)=>{setNickNameInput(e.target.value)}} />
          </li>
          <li className='new-pass-input'>
            <label>Web Address:</label>
            <input value={siteUrlInput} onChange={(e)=>{setSiteUrlInput(e.target.value)}} />
          </li>
          <li className='new-pass-input'>
            <label>Username:</label>
            <input value={userNameInput} onChange={(e)=>{setUserNameInput(e.target.value)}} />
          </li>
          <li className='new-pass-input'>
            <label>Password:</label>
            <input value={passwordInput} onChange={(e)=>{setPasswordInput(e.target.value)}} />
          </li>
          <li className='new-pass-input'>
            <label>Notes:</label>
            <input value={notesInput} onChange={(e)=>{setNotesInput(e.target.value)}} />
          </li>
          <li>
            <button type='button' onClick={()=>{handleCreateNewPassword()}}>Submit</button>
          </li>
          <PasswordGenerator isExpandedByDefault={true} setPasswordInput={setPasswordInput} />
        </ul>
      </form>
    )
  }else{
    //return the closed new password menu
    return( 
    <form className='new-password-form'>
      <h3 className='new-pass-heading' onClick={()=>{setIsMenuExpanded(true)}}>Create New Password</h3>
    </form>
    )
  };
};