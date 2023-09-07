import React, {useEffect, useState} from 'react';
import { VaultController } from '../../Classes/VaultController';
import PasswordGenerator from '../PasswordGenerator/PasswordGenerator';
import './Password.css';

export default function Password({
    password,
    vaultController,
    setPasswords
  }:{
    password:any,
    vaultController:VaultController,
    setPasswords:Function
}){
  const [editPassInput, setEditPassInput] = useState<string>(password.decryptedPassword);
  const [nickNameInput,setNickNameInput] = useState<string>(password.nickName);
  const [siteUrlInput,setSiteUrlInput] = useState<string>(password.siteUrl);
  const [userNameInput,setUserNameInput] = useState<string>(password.userName);
  const [notesInput,setNotesInput] = useState<string>(password.decryptedNotes || '');
  const [isUserEditing,setIsUserEditing] = useState<boolean>(false);
  const [isPasswordExpanded, setIsPasswordExpanded] = useState<boolean>(false);

  const [passwordHealthColor,setPasswordHealthColor] = useState('Blue');
  const [expireDays, setExpireDays] = useState<number>(0);

  //handle initial page load
  useEffect(()=>{
    const expireDays:number = getExpireDays();
    setExpireDays(expireDays);
    setPasswordHealthColor(getPasswordHealthColor(expireDays));
  },[]);

  const getExpireDays = (): number => {
    // Get the time difference in milliseconds
    // basically expiration time - current time. converts the date string to a date then finds the difference in milliseconds
    const timeDifference = new Date(password.expiresOn).getTime() - new Date().getTime(); 
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
    return daysDifference;
  };

  const handleDeletePassword = async function(){
    await vaultController.deletePassword(password._id);
    //refresh client passwords data
    setPasswords(await vaultController.populatePasswords());
  };

  const handleApplyPassChange = async function(){
    //call update password method on vault
    await vaultController
      .updatePassword(
        password._id,
        editPassInput,
        nickNameInput,
        siteUrlInput,
        userNameInput,
        notesInput
      )
      .then(()=>{
        setPasswords(vaultController.passwords);
      }
    );
    //show the updated password in the user's vault
    setIsUserEditing(false);
  };

  const getPasswordHealthColor = function(expireDays:number){
    if (expireDays>=30){
      return 'Blue';
    }else if (expireDays>=14){
      return 'Yellow';
    }else if (expireDays>=3){
      return 'Orange';
    }else if (expireDays>=0){
      return 'Red';
    }else{
      return 'Grey';
    }
  };

  if (!isPasswordExpanded && !isUserEditing){ //check to see if the user is viewing more details on a password. if it isnt display just the password nickname
    return(
      <form className='pass-item'>
        <button className='pass-expand-toggle-button' type='button' onClick={()=>{setIsPasswordExpanded(true)}}>
          {password.nickName}
          &nbsp;
          <span style={{color: passwordHealthColor}}>Password Update: {expireDays} Days</span>
        </button>
      </form>
    );
  }else if (isUserEditing){ //check to see if the user is currently editing this password entry. shows the update password form or the expanded password entry to the user.
    return(
      <form className='pass-item'>
        <button 
          className='pass-expand-toggle-button' 
          type='button' 
          onClick={()=>{
            setIsPasswordExpanded(false);
            setIsUserEditing(false);
          }}
        >
          {password.nickName}
          &nbsp;
          <span style={{color: passwordHealthColor}}>Password Update: {expireDays} Days</span>
        </button>
        <div className='pass-field'>
          <label>Web Address:</label>
          <a href={`${password.siteUrl}`}>{password.siteUrl}</a>
        </div>
        <div className='pass-field'>
          <label>Username:</label>
          <span>{password.userName}</span>
        </div>
        <div className='pass-field'>
          <label>Password:</label>
          <span>{password.decryptedPassword}</span>
        </div>
        <div className='pass-field'>
          <label>Notes:</label>
          <span>{password.decryptedNotes}</span>
        </div>
        <ul className='pass-buttons-container'>
          <li>
            <button type='button' onClick={()=>{setIsUserEditing(true)}}>Edit</button>
          </li>
          <li>
            <button type='button' onClick={()=>{handleDeletePassword()}}>Delete</button>
          </li>
        </ul>
      </form>
    );
  }else{ //we can assume the user is editing their password and the password is expanded
    return(
      <form className='pass-item'>
        <button 
          className='pass-expand-toggle-button' 
          type='button' 
          onClick={()=>{
            setIsPasswordExpanded(false);
            setIsUserEditing(false);
          }}
        >
          {password.nickName}
          &nbsp;
          <span style={{color: passwordHealthColor}}>Password Update: {expireDays} Days</span>
        </button>
        <div className='pass-field'>
          <label>Nickname:</label>
          <input value={nickNameInput} onChange={(e)=>{setNickNameInput(e.target.value)}} />
        </div>
        <div className='pass-field'>
          <label>Web Address:</label>
          <input value={siteUrlInput} onChange={(e)=>{setSiteUrlInput(e.target.value)}} />
        </div>
        <div className='pass-field'>
          <label>Username:</label>
          <input value={userNameInput} onChange={(e)=>{setUserNameInput(e.target.value)}} />
        </div>
        <div className='pass-field'>
          <label>Password:</label>
          <input value={editPassInput} onChange={(e)=>{setEditPassInput(e.target.value)}} />
        </div>
        <div className='pass-field'>
          <label>Notes:</label>
          <input value={notesInput} onChange={(e)=>{setNotesInput(e.target.value)}} />
        </div>
        <ul className='pass-buttons-container'>
          <li>
            <button type='button' onClick={()=>{handleApplyPassChange()}}>Save</button>
          </li>
          <li>
            <button type='button' onClick={()=>{setIsUserEditing(false)}}>Cancel</button>
          </li>
        </ul>
        <PasswordGenerator isExpandedByDefault={false} setPasswordInput={setEditPassInput} />
      </form>
    );
  };
};