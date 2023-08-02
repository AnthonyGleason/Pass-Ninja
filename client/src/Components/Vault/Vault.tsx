import React, { useEffect, useState } from 'react';
import { VaultBrowser } from '../../Classes/VaultBrowser';
import NewPasswordForm from '../NewPasswordForm/NewPasswordForm';
import Password from '../Password/Password';

export default function VaultComponent({vaultBrowser}:{vaultBrowser:VaultBrowser}){
  const [passwords,setPasswords] = useState<any[]>([]);
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
      <h3>Vault</h3>
      {
        passwords.map((password)=>{return(<Password vault={vault} password={password} setPasswords={setPasswords} />)})
      }
      <NewPasswordForm vault={vault} setPasswords={setPasswords} />
    </div>
  )
};