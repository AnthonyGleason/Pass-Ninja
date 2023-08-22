import React, {useState} from "react";
import { encryptPassword } from "../../../Helpers/Passwords";
import { VaultController } from "../../../Classes/VaultController";
import { useNavigate } from "react-router-dom";

export default function PasswordSetting({vaultController}:{vaultController:VaultController}){
  const [newMasterPassInput,setNewMasterPassInput] = useState<string>('');
  const [newMasterPassConfInput,setNewMasterPassConfInput] = useState<string>('');
  const [curMasterPassInput,setCurMasterPassInput] = useState<string>('');
  const navigate = useNavigate();
  const handleApplyChanges = async function(){
    let updatedPasswords:any[] = [];
    //handle master password update
    if (newMasterPassInput){
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
      await response.json().then(()=>{
        //redirect user to login with new details
        navigate('/vault/login');
      });
    }catch(e){
      console.log(`There was an error ${e} when updating your account settings.`)
    };
  };

  return(
    <div>
      <h4>Warning: Changing your master password can cause password corruption in very rare cases. Please ensure you have backed up your vault before proceeding.</h4>
      <p>Enter a new master password</p>
      <input type='password' value={newMasterPassInput} onChange={(e)=>{setNewMasterPassInput(e.target.value)}} />
      <p>Enter a new master password (again)</p>
      <input type='password' value={newMasterPassConfInput} onChange={(e)=>{setNewMasterPassConfInput(e.target.value)}} />
      <div>
        <p>You must enter your correct current master password to apply this change.</p>
        <input placeholder='Current Master Password' type='password' value={curMasterPassInput} onChange={(e)=>{setCurMasterPassInput(e.target.value)}} />
        <button type='button' onClick={()=>{handleApplyChanges()}}>Apply Settings</button>
        <button type='button' onClick={()=>{navigate('/vault')}}>Go Back</button>
      </div>
    </div>
  )
}