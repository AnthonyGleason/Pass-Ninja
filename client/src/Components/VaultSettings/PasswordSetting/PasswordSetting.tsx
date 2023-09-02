import React, {useState} from "react";
import { encryptString } from "../../../Helpers/Passwords";
import { VaultController } from "../../../Classes/VaultController";
import { useNavigate } from "react-router-dom";
import { Password } from "../../../Interfaces/Interfaces";

export default function PasswordSetting({vaultController}:{vaultController:VaultController}){
  const [newMasterPassInput,setNewMasterPassInput] = useState<string>('');
  const [newMasterPassConfInput,setNewMasterPassConfInput] = useState<string>('');
  const [curMasterPassInput,setCurMasterPassInput] = useState<string>('');
  const navigate = useNavigate();
  const handleApplyChanges = async function(){
    let updatedPasswords:any[] = [];
    //handle master password update
    if (
      newMasterPassInput && // a new master password was provided
      newMasterPassConfInput && // the user has entered a master password confirmation
      newMasterPassInput === newMasterPassConfInput // the user has verified their new master password
    ){
      vaultController.passwords.forEach((password:any)=>{
        let updatedPassword:Password = password;
        //encrypt the passwords with the updated master pass input
        updatedPassword.encryptedPassword = encryptString(updatedPassword.decryptedPassword,newMasterPassInput);
        //remove the decryptedPassword and decryptedNotes
        updatedPassword.decryptedPassword = '';
        updatedPassword.decryptedNotes = '';
        //add the password to the updated passwords array
        updatedPasswords.push(updatedPassword);
      });
    };
    //send updated fields to server along with encrypted passwords
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
          updatedEmail: '', //if an empty string is provided (when the email is not being updated) the server will handle validation of this
          updatedPasswords: updatedPasswords,
        }),
      });
      await response.json()
        .then(()=>{
          //redirect user to login with new details
          navigate('/vault/login');
        });
    }catch(e){
      console.log(`There was an error ${e} when updating your account settings.`)
    };
  };

  return(
    <form className="password-update-form">
      <h4>Warning: Changing your master password can cause password corruption in very rare cases. Please ensure you have backed up your vault before proceeding.</h4>
      <div>
        <label>Enter a new master password:</label>
        <input type='password' value={newMasterPassInput} onChange={(e)=>{setNewMasterPassInput(e.target.value)}} />
      </div>
      <div>
        <label>Enter a new master password (again):</label>
        <input type='password' value={newMasterPassConfInput} onChange={(e)=>{setNewMasterPassConfInput(e.target.value)}} />
      </div>
      <div>
        <label>Enter your current master password:</label>
        <input placeholder='Current Master Password' type='password' value={curMasterPassInput} onChange={(e)=>{setCurMasterPassInput(e.target.value)}} />
      </div>
      <ul className="password-setting-button-container">
        <li>
          <button type='button' onClick={()=>{handleApplyChanges()}}>Apply Settings</button>
        </li>
        <li>
          <button type='button' onClick={()=>{navigate('/vault')}}>Go Back</button>
        </li>
      </ul>
    </form>
  );
};