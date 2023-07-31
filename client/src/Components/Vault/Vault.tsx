import React, { useEffect, useState } from 'react';
import { VaultBrowser } from '../../Classes/VaultBrowser';
import PasswordGenerator from '../PasswordGenerator/PasswordGenerator';
import PasswordsContainer from '../PasswordsContainer/PasswordsContainer';
import NewPasswordForm from '../NewPasswordForm/NewPasswordForm';

export default function VaultComponent({vaultBrowser}:{vaultBrowser:VaultBrowser}){
  const [passwords,setPasswords] = useState<any[]>([]);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const vault = vaultBrowser.vault;
  //get passwords to populate passwords state on initial page load
  useEffect(()=>{
    const handleInitialPageLoad = async()=>{
      setPasswords(await vaultBrowser.vault.populatePasswords());
    };
    handleInitialPageLoad();
  },[]);

  return(
    <div className='vault'>
      <PasswordsContainer passwords={passwords} vault={vault} setPasswords={setPasswords} />
      <NewPasswordForm passwordInput={passwordInput} setPasswordInput={setPasswordInput} vault={vault} setPasswords={setPasswords} />
      <PasswordGenerator setPasswordInput={setPasswordInput} />
    </div>
  )
};