import React, { useEffect, useState } from 'react';
import cryptoJS from 'crypto-js';
import { v4 as uuidGen } from 'uuid';
import { Vault } from '../../Classes/Vault';

export default function VaultComponent({vault}:{vault:Vault}){
  const [passwords,setPasswords] = useState(vault.passwords);

  return(
    <div className='vault'>
      {
        passwords.map((pass,index)=>{
          return(
            <div key={uuidGen()}>
              Password Entry
            </div>
          )
        })
      }
    </div>
  )
};

//encrypt the password using the masterPassword
export const encryptPassword = function(password: string, masterPassword: string): string {
  return cryptoJS.AES.encrypt(password, masterPassword).toString();
};

//decrypt the password will be used on client
export const decryptPassword = function(encryptedPassword: string, masterPassword: string): string {
  const decryptedBytes = cryptoJS.AES.decrypt(encryptedPassword, masterPassword);
  return decryptedBytes.toString(cryptoJS.enc.Utf8);
};