import React, {useState,useEffect} from 'react';
import { VaultBrowser } from '../../Classes/VaultBrowser';
import { useNavigate } from 'react-router-dom';
import { encryptPassword } from '../../Helpers/Passwords';
import { verifyToken } from '../../Helpers/Auth';
import LogoutPopup from '../LogoutPopup/LogoutPopup';

export default function AccountSettings({vaultBrowser}:{vaultBrowser:VaultBrowser}){
  const [emailAddressInput,setEmailAddressInput] = useState<string>(vaultBrowser.login.emailInput);
  const [curMasterPassInput,setCurMasterPassInput] = useState<string>('');
  const [newMasterPassInput, setNewMasterPassInput] = useState<string>('');
  const [newMasterPassConfInput, setNewMasterPassConfInput] = useState<string>('');
  //these booleans will let the user know which fields are going to be updatedb
  const [isMasterPassUpdated, setIsMasterPassUpdated] = useState<boolean>(false);
  const [isEmailUpdated, setIsEmailUpdated] = useState<boolean>(false);
  const [isUserLoggedOut,setIsUserLoggedOut] = useState<boolean>(false);
  useEffect(()=>{
    const handleInitialPageLoad = async()=>{
      //verify the users token and master password is present
      if (!await verifyToken(localStorage.getItem('token') as string) || !vaultBrowser.vault.masterPassword){
        // session is invalid, show user logged out popup
        setIsUserLoggedOut(true);
      };
    };
    handleInitialPageLoad();
  },[]);

  const handleConfirmChanges = async function(){
    //send updated fields to server along with encrypted passwords
    let updatedPasswords:any[] = [];
    //handle email is updated
    let tempEmail:string ='';
    if (isEmailUpdated){
      tempEmail = emailAddressInput;
    };
    //handle master pass updating
    if (isMasterPassUpdated){
      vaultBrowser.vault.passwords.forEach((password:any)=>{
        let updatedPassword:any = password;
        //encrypt the passwords with the new master pass input
        updatedPassword.encryptedPassword = encryptPassword(updatedPassword.decryptedPassword,newMasterPassInput);
        //stop the decryptedPassword and decryptedNotes from being sent to the server (* will come back to this with a better approach)
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
          updatedEmail: tempEmail,
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
    //all password inputs are not empty and new passwords match
    if (newMasterPassInput && newMasterPassConfInput && newMasterPassInput===newMasterPassConfInput){
      setIsMasterPassUpdated(true);
    }
    //email is being updated (different than the usnew arrayer's current email) and the email is not an empty string
    if (emailAddressInput!== vaultBrowser.login.emailInput && emailAddressInput){
      setIsEmailUpdated(true);
    };
  };
  const navigate = useNavigate();

  if (isUserLoggedOut){
    return(<LogoutPopup />)
  };
  
  if (isEmailUpdated || isMasterPassUpdated){
    return(
      <div>
        <h3>The following changes will be applied.</h3>
        <ul>
          {isEmailUpdated ? (
            <li>The email associated with your account will change from {vaultBrowser.login.emailInput} to {emailAddressInput}</li>
          ) : (
            null
          )}
          {isMasterPassUpdated ? (
            <li>The master password associated with your account will change. (password hidden for your security).</li>
          ) : (
            null
          )}
        </ul>
        <p>Enter your current master password</p>
        <input type='password' value={curMasterPassInput} onChange={(e)=>{setCurMasterPassInput(e.target.value)}} />
        <button onClick={()=>{handleConfirmChanges()}}>Confirm</button>
        <button onClick={()=>{navigate('/vault')}}>Cancel</button>
      </div>
    )
  }else{
    return(
      <div>
        <h3>Account settings</h3>
        <button type='button' onClick={()=>{navigate('/vault')}}>Go Back</button>
        <div>
          {/* make drop down forms later */}
          <p>Change your login email address</p>
          <input type='email' value={emailAddressInput} onChange={(e)=>{setEmailAddressInput(e.target.value)}} />
        </div>
        <div>
          <p>Change your master password</p>
          <p>Enter your new master password</p>
          <input type='password' value={newMasterPassInput} onChange={(e)=>{setNewMasterPassInput(e.target.value)}} />
          <p>Enter your new master password (again)</p>
          <input type='password' value={newMasterPassConfInput} onChange={(e)=>{setNewMasterPassConfInput(e.target.value)}} />
        </div>
        <h3>Warning: These are critical settings and in very rare cases can cause corruption of your account. Please ensure you have backed up your vault before proceeding.</h3>
        <p>You will have an opportunity to confirm your account changes on the next page.</p>
        <button type='button' onClick={()=>{handleMakeChangesPress()}}>Update Account Settings</button>
      </div>
    );
  };
};