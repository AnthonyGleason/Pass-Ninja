import React, {useState} from 'react';
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

  if (!isPasswordExpanded){ //check to see if the user is viewing more details on a password. if it isnt display just the password nickname
    return(
      <h5 onClick={()=>{setIsPasswordExpanded(true)}}>{password.nickName}</h5>
    )
  }else if (!isUserEditing){ //check to see if the user is currently editing this password entry. shows the update password form or the expanded password entry to the user.
    return(
      <div className='password'>
        <h5 onClick={()=>{setIsPasswordExpanded(false)}}>{password.nickName}</h5>
        <p><a href={`${password.siteUrl}`}>{password.siteUrl}</a></p>
        <p>Username: {password.userName}</p>
        {/* Note: .decryptedPassword property is created when passwords are decrypted during login */}
        <p>Password: {password.decryptedPassword}</p>
        <p>Notes: {password.decryptedNotes}</p>
        <button type='button' onClick={()=>{setIsUserEditing(true)}}>Edit</button>
        <button type='button' onClick={()=>{handleDeletePassword()}}>Delete</button>
      </div>
    )
  }else{
    return(
      <form className='password'>
        <h5 onClick={()=>{setIsPasswordExpanded(false)}}>{password.nickName}</h5>
        <div>
          <p>Nickname</p>
          <input value={nickNameInput} onChange={(e)=>{setNickNameInput(e.target.value)}} />
        </div>
        <div>
          <p>Website Url</p>
          <input value={siteUrlInput} onChange={(e)=>{setSiteUrlInput(e.target.value)}} />
        </div>
        <div>
          <p>Username</p>
          <input value={userNameInput} onChange={(e)=>{setUserNameInput(e.target.value)}} />
        </div>
        <div>
          <p>Password</p>
          <input value={editPassInput} onChange={(e)=>{setEditPassInput(e.target.value)}} />
        </div>
        <div>
          <p>Notes</p>
          <input value={notesInput} onChange={(e)=>{setNotesInput(e.target.value)}} />
        </div>
        <div>
          <button type='button' onClick={()=>{handleApplyPassChange()}}>Apply Changes</button>
          <button type='button' onClick={()=>{setIsUserEditing(false)}}>Cancel</button>
        </div>
        <PasswordGenerator isExpandedByDefault={false} setPasswordInput={setEditPassInput} />
      </form>
    );
  };
};