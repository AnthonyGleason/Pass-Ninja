import React, { useEffect, useState } from 'react';
import { v4 as uuidGen } from 'uuid';
import { VaultBrowser } from '../../Classes/VaultBrowser';
import PasswordGenerator from '../PasswordGenerator/PasswordGenerator';
import { decryptPassword } from '../../Helpers/Passwords';

export default function VaultComponent({vaultBrowser}:{vaultBrowser:VaultBrowser}){
  const [passwords,setPasswords] = useState<any[]>([]);
  //create the input states in the vault class
  const [nickNameInput,setNickNameInput] = useState<string>('');
  const [siteUrlInput, setSiteUrlInput] = useState<string>('https://www.');
  const [userNameInput, setUserNameInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');

  //get passwords to populate passwords state on initial page load
  useEffect(()=>{
    const handleInitialPageLoad = async()=>{
      setPasswords(await getPasswords());
    };
    handleInitialPageLoad();
  },[]);

  const handleCreateNewPassword = async function(){
    vaultBrowser.vault.nickNameInput = nickNameInput;
    vaultBrowser.vault.siteUrlInput = siteUrlInput;
    vaultBrowser.vault.userNameInput = userNameInput;
    vaultBrowser.vault.passwordInput = passwordInput;
    await vaultBrowser.vault.createNewPassword();
    setPasswords(await getPasswords());
  };
  
  

  const getPasswords = async function():Promise<any[]>{
    let fetchedPasswords:any[] = [];
    await fetch(`http://localhost:5000/v1/api/vaults/passwords/`,{
      method: 'GET',
      headers:{
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
      }
    })
    .then(async (responseData:any)=>{
      //decrypt passwords
      const data = await responseData.json();
      let passwords: any[] = data.passwords;
      passwords.forEach((password:any)=>{
        if (!password.encryptedPassword) return;
        password.decryptedPassword=decryptPassword(password.encryptedPassword,vaultBrowser.vault.masterPassword);
      });
      fetchedPasswords = passwords;
    });
    return fetchedPasswords;
  };

  const handleDeletePassword = async function(passwordID:string){
    const response = await fetch(`http://localhost:5000/v1/api/vaults/passwords/${passwordID}`,{
      method: 'DELETE',
      headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
      }
    });
    //refresh passwords
    setPasswords(await getPasswords());
  };

  return(
    <div className='vault'>
      <form method='POST' action='http://localhost:5000/api/v1/vaults/passwords'>
        <h3>New Password</h3>
        <div>
          <label>Nickname</label>
          <input value={nickNameInput} onChange={(e)=>{setNickNameInput(e.target.value)}} />
        </div>
        <div>
          <label>Web Address</label>
          <input value={siteUrlInput} onChange={(e)=>{setSiteUrlInput(e.target.value)}} />
        </div>
        <div>
          <label>Username</label>
          <input value={userNameInput} onChange={(e)=>{setUserNameInput(e.target.value)}} />
        </div>
        <div>
          <label>Password</label>
          <input value={passwordInput} onChange={(e)=>{setPasswordInput(e.target.value)}} />
        </div>
        <button type='button' onClick={()=>{handleCreateNewPassword()}}>Create New Password</button>
      </form>
      {
        passwords.map((password)=>{
          return(
            <div key={uuidGen()}>
              <p>Nickname: {password.nickName}</p>
              <p>Site Url: <a href={`${password.siteUrl}`}>{password.siteUrl}</a></p>
              <p>Username: {password.userName}</p>
              {/* Note: .decryptedPassword property is created when passwords are decrypted during login */}
              <p>Password: {password.decryptedPassword}</p> 
              <button onClick={()=>{handleDeletePassword(password._id)}}>Delete</button>
            </div>
          )
        })
      }
      <PasswordGenerator />
    </div>
  )
};