import React, { useEffect, useState } from 'react';
import { VaultBrowser } from '../../Classes/VaultBrowser';
import { v4 as uuidGen } from 'uuid';
import NewPasswordForm from '../NewPasswordForm/NewPasswordForm';
import Password from '../Password/Password';
import { verifyToken } from '../../Helpers/Auth';
import { useNavigate } from 'react-router-dom';

export default function VaultComponent({vaultBrowser}:{vaultBrowser:VaultBrowser}){
  const [passwords,setPasswords] = useState<any[]>([]);
  const vault = vaultBrowser.vault;
  const navigate = useNavigate();
  //get passwords to populate passwords state on initial page load
  useEffect(()=>{
    const handleInitialPageLoad = async()=>{
      //verify the users token and master password is present
      if (await verifyToken(localStorage.getItem('token') as string) && vault.masterPassword){
        setPasswords(await vaultBrowser.vault.populatePasswords());
      }else{
        //redirect the user to login again, session is invalid
        navigate('/login');
      }
    };
    handleInitialPageLoad();
  },[]);
  
  return(
    <div className='vault'>
      <h3>Vault</h3>
      {
        passwords.map((password)=>{return(<Password key={uuidGen()} vault={vault} password={password} setPasswords={setPasswords} />)})
      }
      <NewPasswordForm vault={vault} setPasswords={setPasswords} />
    </div>
  )
};