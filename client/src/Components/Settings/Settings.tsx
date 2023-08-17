import React, {useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { encryptPassword } from '../../Helpers/Passwords';
import { handleProtectedInitialPageLoad} from '../../Helpers/Auth';
import LogoutPopup from '../LogoutPopup/LogoutPopup';
import { VaultController } from '../../Classes/VaultController';
import './Settings.css';

export default function Settings({vaultController}:{vaultController:VaultController}){
  const [emailAddressInput,setEmailAddressInput] = useState<string>('');
  const [curMasterPassInput,setCurMasterPassInput] = useState<string>('');
  const [newMasterPassInput, setNewMasterPassInput] = useState<string>('');
  const [newMasterPassConfInput, setNewMasterPassConfInput] = useState<string>('');
  //these booleans control the expansion of menu items
  const [isEmailMenuSettingExpanded, setIsEmailMenuSettingExpanded] = useState<boolean>(false);
  const [isPasswordMenuSettingExpanded, setIsPasswordMenuSettingExpanded] = useState<boolean>(false);

  //these booleans will let the user know which fields are going to be updated
  const [isMasterPassUpdated, setIsMasterPassUpdated] = useState<boolean>(false);
  const [isEmailUpdated, setIsEmailUpdated] = useState<boolean>(false);
  const [isUserLoggedOut,setIsUserLoggedOut] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(()=>{
    handleProtectedInitialPageLoad(
      vaultController,
      ()=>{}, //supplied empty function because we do not need to update the passwords here
      setIsUserLoggedOut,
    );
  },[]);

  const handleConfirmChanges = async function(){
    //send updated fields to server along with encrypted passwords
    let updatedPasswords:any[] = [];
    //handle email is updated
    let tempEmail:string ='';
    //handle email update
    if (isEmailUpdated) tempEmail = emailAddressInput;
    //handle master password update
    if (isMasterPassUpdated){
      vaultController.passwords.forEach((password:any)=>{
        let updatedPassword:any = password;
        //encrypt the passwords with the updated master pass input
        updatedPassword.encryptedPassword = encryptPassword(updatedPassword.decryptedPassword,newMasterPassInput);
        //stop the decryptedPassword and decryptedNotes from being sent to the server
        updatedPassword.decryptedPassword = undefined;
        updatedPassword.decryptedNotes = undefined;
        //add the password to the updated passwords array
        updatedPasswords.push(updatedPassword);
      });
    };
    
    try{
      const response = await fetch('http://localhost:5000/v1/api/vaults/settings',{
        method: 'PUT',
        headers:{
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        },
        body: JSON.stringify({
          updatedMasterPassword: newMasterPassInput,
          updatedMasterPasswordConfirm: newMasterPassConfInput,
          currentMasterPassword: curMasterPassInput,
          updatedEmail: tempEmail, //if an empty string is provided (when the email is not being updated) the server will handle validation of this
          updatedPasswords: updatedPasswords,
        }),
      });
      await response.json().then(()=>{
        //redirect user to login with new details
        navigate('/login');
      });
    }catch(e){
      console.log(`There was an error ${e} when updating your account settings.`)
    };
  };

  //check to see which inputs were changed and also switches to confirm changes view once the state is updated
  const handleMakeChangesPress = function(){
    //all password inputs are not empty and new password matches the confirmation password
    if (newMasterPassInput && newMasterPassConfInput && newMasterPassInput===newMasterPassConfInput){
      setIsMasterPassUpdated(true);
    }
    //email is being updated (different than the user's current email) and the email is not an empty string
    if (emailAddressInput){
      setIsEmailUpdated(true);
    };
  };
  
  if (isUserLoggedOut){
    return(<LogoutPopup />) //user is not signed in, prevent access
  }else if (isEmailUpdated || isMasterPassUpdated){ //any of the settings are updated
    return(
      // show user changes that will be applied to their vault
      <div className='account-settings'>
        <h3>The Following Changes Will Be Applied</h3>
        <ul>
          {
            isEmailUpdated ? (
              <li>The email associated with your account will change to {emailAddressInput}</li>
            ) : (
              null
            )
          }
          {
            isMasterPassUpdated ? (
              <li>The master password associated with your account will change. (password hidden for your security).</li>
            ) : (
              null
            )
          }
        </ul>
        <div className='master-pass-confirm-input'>
          <label>Enter your current master password</label>
          <input type='password' value={curMasterPassInput} onChange={(e)=>{setCurMasterPassInput(e.target.value)}} required />
        </div>
        <div>
          <button onClick={()=>{handleConfirmChanges()}}>Confirm</button>
          <button onClick={()=>{navigate('/vault')}}>Cancel</button>
        </div>
      </div>
    )
  }else{
    return(
      // menu which lets the user update their account settings
      <div className='account-settings'>
        <h3>Account Settings</h3>
        <h4>Warning: These are critical settings and in very rare cases can cause corruption of your account. Please ensure you have backed up your vault before proceeding.</h4>
        <div className='settings-update-container'>
          <button onClick={()=>{isEmailMenuSettingExpanded===true ? setIsEmailMenuSettingExpanded(false) : setIsEmailMenuSettingExpanded(true)}}>
            Update Email Address
          </button>
          {
            isEmailMenuSettingExpanded ? (
              <>
                <label>Enter a new email address</label>
                <input type='email' value={emailAddressInput} onChange={(e)=>{setEmailAddressInput(e.target.value)}} />
              </>
            ) : (
              null
            )
          }
        </div>
        <div className='settings-update-container'>
          <button onClick={()=>{isPasswordMenuSettingExpanded===true ? setIsPasswordMenuSettingExpanded(false) : setIsPasswordMenuSettingExpanded(true)}}>
            Update Master Password
          </button>
          {
            isPasswordMenuSettingExpanded ? (
              <>
                <p>Enter a new master password</p>
                <input type='password' value={newMasterPassInput} onChange={(e)=>{setNewMasterPassInput(e.target.value)}} />
                <p>Enter a new master password (again)</p>
                <input type='password' value={newMasterPassConfInput} onChange={(e)=>{setNewMasterPassConfInput(e.target.value)}} />
              </>
            ) : (
              null
            )
          }
        </div>
        <p>You will have an opportunity to confirm your account changes on the next page.</p>
        <div>
          <button type='button' onClick={()=>{handleMakeChangesPress()}}>Apply Settings</button>
          <button type='button' onClick={()=>{navigate('/vault')}}>Go Back</button>
        </div>
      </div>
    );
  };
};