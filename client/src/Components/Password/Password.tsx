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
    await vaultController.updatePassword(password._id,editPassInput,nickNameInput,siteUrlInput,userNameInput,notesInput)
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

  if (!isPasswordExpanded){ //check to see if the user is viewing more details on a password. if it isnt display just the password nickname
    return(
      <h5 onClick={()=>{setIsPasswordExpanded(true)}}>
        <span>{password.nickName}</span>
        &nbsp;
        <span style={{color: passwordHealthColor}}>Password Update: {expireDays} Days</span>
      </h5>
    )
  }else if (!isUserEditing){ //check to see if the user is currently editing this password entry. shows the update password form or the expanded password entry to the user.
    return(
      <form className='password'>
        <h5 onClick={()=>{setIsPasswordExpanded(false)}}>
          <span>{password.nickName}</span>
          &nbsp;
          <span style={{color: passwordHealthColor}}>Password Update: {expireDays} Days</span>
        </h5>
        <div className='password-content'>
          <p className='pass-field-alt'>
            <h4>Web Address:</h4>
            <a href={`${password.siteUrl}`}>{password.siteUrl}</a>
          </p>
          <p className='pass-field-alt'>
            <h4>Username:</h4>
            <span>{password.userName}</span>
          </p>
          {/* Note: .decryptedPassword property is created when passwords are decrypted during login */}
          <p className='pass-field-alt'>
            <h4>Password:</h4>
            <span>{password.decryptedPassword}</span>
          </p>
          <p>
            <h4>Notes:</h4>
            <span>{password.decryptedNotes}</span>
          </p>
          <button type='button' onClick={()=>{setIsUserEditing(true)}}>Edit</button>
          <button type='button' onClick={()=>{handleDeletePassword()}}>Delete</button>
        </div>
      </form>
    )
  }else{
    return(
      <form className='password'>
        <h5 onClick={()=>{setIsPasswordExpanded(false)}}>
          <span>{password.nickName}</span>
          &nbsp;
          <span style={{color: passwordHealthColor}}>Password Update: {expireDays} Days</span>
        </h5>
        <div className='password-content'>
          <div className='pass-field'>
            <label>Nickname:</label>
            <input value={nickNameInput} onChange={(e)=>{setNickNameInput(e.target.value)}} />
          </div>
          <div className='pass-field'>
            <label>Web Address:</label>
            <input value={siteUrlInput} onChange={(e)=>{setSiteUrlInput(e.target.value)}} />
          </div >
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
          <div>
            <button type='button' onClick={()=>{handleApplyPassChange()}}>Apply Changes</button>
            <button type='button' onClick={()=>{setIsUserEditing(false)}}>Cancel</button>
          </div>
          <PasswordGenerator isExpandedByDefault={false} setPasswordInput={setEditPassInput} />
        </div>
      </form>
    );
  };
};