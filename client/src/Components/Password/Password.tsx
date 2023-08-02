import React, {useState} from 'react';
import { v4 as uuidGen } from 'uuid';
import { Vault } from '../../Classes/Vault';
import PasswordGenerator from '../PasswordGenerator/PasswordGenerator';

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
  const [isUserEditing,setIsUserEditing] = useState<boolean>(false);
  const handleDeletePassword = async function(){
    await vault.deletePassword(password._id);
    //refresh client passwords data
    setPasswords(await vault.populatePasswords());
  };
  const handleApplyPassChange = async function(){
    //set inputs in vault
    //call update password property on vault
    
  };
  //check if the user is currently editing this password or not
  if (!isUserEditing){
    return(
      <div className='password' key={uuidGen()}>
        <p>{password.nickName}</p>
        <p><a href={`${password.siteUrl}`}>{password.siteUrl}</a></p>
        <p>Username: {password.userName}</p>
        {/* Note: .decryptedPassword property is created when passwords are decrypted during login */}
        <p>Password: {password.decryptedPassword}</p>
        <button onClick={()=>{setIsUserEditing(true)}}>Edit</button>
        <button onClick={()=>{handleDeletePassword()}}>Delete</button>
      </div>
    )
  }else{
    return(
      <form>
        <div>
          <p>Nickname</p>
          <input value={password.nickName} />
        </div>
        <div>
          <p>Website Url</p>
          <input value={password.siteUrl} />
        </div>
        <div>
          <p>Username</p>
          <input value={password.userName} />
        </div>
        <div>
          <p>Password</p>
          <input value={editPassInput} onChange={(e)=>{setEditPassInput(e.target.value)}} />
        </div>
        <div>
          <button onClick={()=>{handleApplyPassChange()}}>Apply Changes</button>
          <button onClick={()=>{setIsUserEditing(false)}}>Cancel</button>
        </div>
        <PasswordGenerator setPasswordInput={setEditPassInput} />
      </form>
    )
  }
}