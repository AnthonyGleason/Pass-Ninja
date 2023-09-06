import React, { useEffect, useState } from 'react';
import { v4 as uuidGen } from 'uuid';
import NewPasswordForm from '../NewPasswordForm/NewPasswordForm';
import Password from '../Password/Password';
import { handleProtectedInitialPageLoad} from '../../Helpers/Auth';
import LogoutPopup from '../LogoutPopup/LogoutPopup';
import { VaultController } from '../../Classes/VaultController';
import './Vault.css';
import VaultNav from '../VaultNav/VaultNav';

export default function VaultComponent({vaultController}:{vaultController:VaultController}){
  /* 
    I have chosen to use the passwords state to hold all passwords in an array and passSnip to hold all passwords that fit the users search input.
    The idea here is to allow the user to navigate their vault quicker by allowing them to instantly search their library as they type rather
    then having to press a search button after changing their search input to perform a search. This is more mobile friendly because some users may have
    issues pressing on smaller elements on the page.
  */
  const [passwords,setPasswords] = useState<any[]>(vaultController.passwords);
  const [passSnip,setPassSnip] = useState<any[]>([]);
  const [isUserLoggedOut,setIsUserLoggedOut] = useState<boolean>(false);
  
  //get passwords to populate passwords state on initial page load
  useEffect(()=>{
    handleProtectedInitialPageLoad(
      vaultController,
      setPassSnip,
      setIsUserLoggedOut
    );
  },[]);
  
  if (isUserLoggedOut){
    return(<LogoutPopup />)
  }else{
    return(
      <main className='vault'>
        <VaultNav setPassSnip={setPassSnip} vaultController={vaultController}/>
        <ul className='passwords-container'>
          {
            passSnip.map((password)=>{return(
              <li key={uuidGen()} className='pass-item-wrapper'>
                <Password vaultController={vaultController} password={password} setPasswords={setPasswords} />
              </li>
            )})
          }
        </ul>
        <NewPasswordForm vaultController={vaultController} setPasswords={setPasswords} />
      </main>
    )
  };
};