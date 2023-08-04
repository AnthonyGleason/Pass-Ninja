import React, {useState} from 'react';
import { VaultBrowser } from '../../Classes/VaultBrowser';
import { useNavigate } from 'react-router-dom';

export default function AccountSettings({vaultBrowser}:{vaultBrowser:VaultBrowser}){
  const [emailAddressInput,setEmailAddressInput] = useState<string>(vaultBrowser.login.emailInput);
  const [curMasterPassInput,setCurMasterPassInput] = useState<string>('');
  const [newMasterPassInput, setNewMasterPassInput] = useState<string>('');
  const [newMasterPassConfInput, setNewMasterPassConfInput] = useState<string>('');
  const [errorMessage,setErrorMessage] = useState<string>('');

  const handleMakeChangesPress = async function(){
    //check to see which inputs were changed
    //notify the user in a popup what fields will be updated and to confirm it one last time
    //if the user okays it then proceed
  };

  const navigate = useNavigate();

  return(
    <div>
      <h3>Account settings</h3>
      <button type='button' onClick={()=>{navigate('/vault')}}>Go Back</button>
      <div>
        {/* make drop down forms later */}
        <p>Change your login email address</p>
        <input value={emailAddressInput} onChange={(e)=>{setEmailAddressInput(e.target.value)}} />
      </div>
      <div>
        <p>Change your master password</p>
        <h3>WARNING this is a potentially <b>destructive</b> action please ensure you have backed up your vault before changing your master password</h3>
        <p>Enter your current master password</p>
        <input type='password' value={curMasterPassInput} onChange={(e)=>{setCurMasterPassInput(e.target.value)}} />
        <p>Enter your new master password</p>
        <input type='password' value={newMasterPassInput} onChange={(e)=>{setNewMasterPassInput(e.target.value)}} />
        <p>Enter your new master password (again)</p>
        <input type='password' value={newMasterPassConfInput} onChange={(e)=>{setNewMasterPassConfInput(e.target.value)}} />
      </div>
      <button type='button' onClick={()=>{handleMakeChangesPress()}}>Make Changes</button>
      <p>{errorMessage}</p>
    </div>
  )
}