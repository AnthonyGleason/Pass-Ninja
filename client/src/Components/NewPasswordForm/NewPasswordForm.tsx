import React, {useState} from 'react';
import { VaultController } from '../../Classes/VaultController';
import PasswordGenerator from '../PasswordGenerator/PasswordGenerator';
import menuDownArrow from '../../Assets/menu-down-arrow.svg';
import menuUpArrow from '../../Assets/menu-up-arrow.svg';

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
      <form method='POST' action='http://localhost:5000/api/v1/vaults/passwords'>
        <h3 onClick={()=>{setIsMenuExpanded(false)}}><img src={menuUpArrow} alt='up arrow' />New Password</h3>
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
        <div>
          <label>Notes</label>
          <input value={notesInput} onChange={(e)=>{setNotesInput(e.target.value)}} />
        </div>
        <button type='button' onClick={()=>{handleCreateNewPassword()}}>Create New Password</button>
        <PasswordGenerator setPasswordInput={setPasswordInput} />
      </form>
    )
  }else{
    return( //return the closed new password menu
      <h3 onClick={()=>{setIsMenuExpanded(true)}}><img src={menuDownArrow} alt='drop down arrow' />New Password</h3>
    )
  };
};