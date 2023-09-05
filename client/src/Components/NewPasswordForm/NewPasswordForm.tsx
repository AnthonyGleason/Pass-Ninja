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

  if (isMenuExpanded){ //if the user has expanded the New Password form then display the form to create a new password
    return(
      <form className='new-pass-form' method='POST' action='http://localhost:5000/api/v1/vaults/passwords'>
        <button onClick={()=>{setIsMenuExpanded(false)}}>Create New Password</button>
        <div className='new-pass-input-field'>
          <label>Nickname:</label>
          <input value={nickNameInput} onChange={(e)=>{setNickNameInput(e.target.value)}} />
        </div>
        <div className='new-pass-input-field'>
          <label>Web Address:</label>
          <input value={siteUrlInput} onChange={(e)=>{setSiteUrlInput(e.target.value)}} />
        </div>
        <div className='new-pass-input-field'>
          <label>Username:</label>
          <input value={userNameInput} onChange={(e)=>{setUserNameInput(e.target.value)}} />
        </div>
        <div className='new-pass-input-field'>
          <label>Password:</label>
          <input value={passwordInput} onChange={(e)=>{setPasswordInput(e.target.value)}} />
        </div>
        <div className='new-pass-input-field'>
          <label>Notes:</label>
          <input value={notesInput} onChange={(e)=>{setNotesInput(e.target.value)}} />
        </div>
        <ul className='new-pass-buttons-wrapper'>
          <li>
            <button type='button' onClick={()=>{handleCreateNewPassword()}}>Submit</button>
          </li>
          <li>
            <button type='button' onClick={()=>{setIsMenuExpanded(false)}}>Cancel</button>
          </li>
        </ul>
        <PasswordGenerator isExpandedByDefault={true} setPasswordInput={setPasswordInput} />
      </form>
    )
  }else{
    //return the closed new password form
    return( 
    <form className='new-password-form'>
      <button className='new-pass-heading' onClick={()=>{setIsMenuExpanded(true)}}>Create New Password</button>
    </form>
    );
  };
};