import React, {useState} from 'react';
import { Vault } from '../../Classes/Vault';
import PasswordGenerator from '../PasswordGenerator/PasswordGenerator';
import menuDownArrow from '../../Assets/menu-down-arrow.svg';
import menuUpArrow from '../../Assets/menu-up-arrow.svg';

export default function Password({
    password,
    vault,
    setPasswords
  }:{
    password:any,
    vault:Vault,
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
    await vault.deletePassword(password._id);
    //refresh client passwords data
    setPasswords(await vault.populatePasswords());
  };
  const handleApplyPassChange = async function(){
    //call update password method on vault
    setPasswords(await vault.updatePassword(password._id,editPassInput,nickNameInput,siteUrlInput,userNameInput,notesInput));
    setIsUserEditing(false);
  };
  //check if the user is currently editing this password or not
  if (!isPasswordExpanded){
    return(
      <h5 onClick={()=>{setIsPasswordExpanded(true)}}><img src={menuDownArrow} alt='drop down arrow' />{password.nickName}</h5>
    )
  }
  if (!isUserEditing){
    return(
      <div className='password'>
        <h5 onClick={()=>{setIsPasswordExpanded(false)}}><img src={menuUpArrow} alt='up arrow' />{password.nickName}</h5>
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
      <form>
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
        <PasswordGenerator setPasswordInput={setEditPassInput} />
      </form>
    )
  }
}