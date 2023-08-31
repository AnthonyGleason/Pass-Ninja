import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import { VaultController } from "../../../Classes/VaultController";

export default function EmailSetting({vaultController}:{vaultController:VaultController}){
  const [emailAddressInput,setEmailAddressInput] = useState<string>('');
  const [curMasterPassInput,setCurMasterPassInput] = useState<string>('');
  const navigate = useNavigate();
  const handleApplyChanges = async function(){
    try{
      const response = await fetch('http://localhost:5000/v1/api/vaults/settings',{
        method: 'PUT',
        headers:{
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        },
        body: JSON.stringify({
          updatedMasterPassword: '',
          updatedMasterPasswordConfirm: '',
          currentMasterPassword: curMasterPassInput,
          updatedEmail: emailAddressInput, //if an empty string is provided (when the email is not being updated) the server will handle validation of this
          updatedPasswords: [],
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
    <form className="email-update-form">
      <ul className="setting-input-wrapper">
        <li className="email-input-field">
          <label>Enter a new email address:</label>
          <input type='email' value={emailAddressInput} onChange={(e)=>{setEmailAddressInput(e.target.value)}} />
        </li>
        <li className="email-input-field">
          <label>Enter your current master password:</label>
          <input placeholder='Current Master Password' type='password' value={curMasterPassInput} onChange={(e)=>{setCurMasterPassInput(e.target.value)}} />
        </li>
      </ul>
      <div>
        <button type='button' onClick={()=>{handleApplyChanges()}}>Apply Settings</button>
        <button type='button' onClick={()=>{navigate('/vault')}}>Go Back</button>
      </div>
    </form>
  )
}