import React from 'react';
import { v4 as uuidGen } from 'uuid';
import { Vault } from '../../Classes/Vault';

export default function PasswordsContainer({
    passwords,
    vault,
    setPasswords,
  }:{
    passwords:any[],
    vault:Vault,
    setPasswords:Function
  }){
  const handleDeletePassword = async function(passwordID:string){
    vault.deletePassword(passwordID);
    //refresh client passwords data
    setPasswords(await vault.populatePasswords());
  };

  return(
    <>
    <h3>Vault</h3>
      {
        passwords.map((password)=>{
          return(
            <div key={uuidGen()}>
              <p>{password.nickName}</p>
              <p><a href={`${password.siteUrl}`}>{password.siteUrl}</a></p>
              <p>Username: {password.userName}</p>
              {/* Note: .decryptedPassword property is created when passwords are decrypted during login */}
              <p>Password: {password.decryptedPassword}</p>
              <button onClick={()=>{handleDeletePassword(password._id)}}>Delete</button>
            </div>
          )
        })
      }
    </>
  )
}