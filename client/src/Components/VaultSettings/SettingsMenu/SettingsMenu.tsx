import React, {useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { handleProtectedInitialPageLoad} from '../../../Helpers/Auth';
import LogoutPopup from '../../LogoutPopup/LogoutPopup';
import { VaultController } from '../../../Classes/VaultController';
import './SettingsMenu.css';

export default function SettingsMenu({vaultController}:{vaultController:VaultController}){
  const [curMasterPassInput,setCurMasterPassInput] = useState<string>('');
  const [isUserLoggedOut,setIsUserLoggedOut] = useState<boolean>(false);
  const navigate = useNavigate();
  
  useEffect(()=>{
    handleProtectedInitialPageLoad(
      vaultController,
      ()=>{}, //supplied empty function because we do not need to update the passwords here
      setIsUserLoggedOut,
    );
  },[]);

  if (isUserLoggedOut){
    return(<LogoutPopup />) //user is not signed in, prevent access
  }else{
    return(
      // menu which lets the user update their account settings
      <div className='account-settings'>
        <h3>Account Settings</h3>
        <div className='account-settings-content'>
          <button onClick={()=>{navigate('/vault/settings/email')}}>Email Address</button>
          <button onClick={()=>{navigate('/vault/settings/password')}}>Master Password</button>
          <button onClick={()=>{navigate('/vault/settings/twoFactor')}} type='button'>Two-Factor Authentication</button>
        </div>
      </div>
    );
  };
};