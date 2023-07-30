import React, {useState} from 'react';
import { VaultBrowser } from '../../Classes/VaultBrowser';
import { useNavigate } from 'react-router-dom';

export default function Register({vaultBrowser}:{vaultBrowser:VaultBrowser}){
  const [firstNameInput,setFirstNameInput] = useState<string>(vaultBrowser.inputFields.firstName);
  const [lastNameInput,setLastNameInput] = useState<string>(vaultBrowser.inputFields.lastName);
  const [emailInput,setEmailInput] = useState<string>(vaultBrowser.inputFields.email);
  const [masterPasswordInput,setMasterPasswordInput] = useState<string>(vaultBrowser.inputFields.masterPassword);
  const [masterPasswordConfirmInput, setMasterPasswordConfirmInput] = useState<string>(vaultBrowser.inputFields.masterPasswordConfirm);
  const navigate = useNavigate();
  
  const handleSubmit = async function(){
    const token:string = await vaultBrowser.register();
    localStorage.setItem('jwt',token);
    navigate('/vault');
  };

  const handleInputChange = function(inputType:string,val:string){
    switch(inputType){
      case 'firstName':
        //set input in input fields state
        vaultBrowser.inputFields.firstName = val;
        setFirstNameInput(val);
        break;
      case 'lastName':
        vaultBrowser.inputFields.lastName = val;
        setLastNameInput(val);
        break;
      case 'email':
        vaultBrowser.inputFields.email = val;
        setEmailInput(val);
        break;
      case 'masterPassword':
        vaultBrowser.inputFields.masterPassword = val;
        setMasterPasswordInput(val);
        break;
      case 'masterPasswordConfirm':
        vaultBrowser.inputFields.masterPasswordConfirm = val;
        setMasterPasswordConfirmInput(val);
        break;
      default:
        break;
    };
  };

  return(
    <div className='register'>
      <form>
        <div>
          <label>First Name</label>
          <input type='text' value={firstNameInput} onChange={(e)=>{handleInputChange('firstName',e.target.value)}} />
        </div>
        <div>
          <label>Last Name</label>
          <input type='text' value={lastNameInput} onChange={(e)=>{handleInputChange('lastName',e.target.value)}} />
        </div>
        <div>
          <label>Email</label>
          <input type='email' value={emailInput} onChange={(e)=>{handleInputChange('email',e.target.value)}} />
        </div>
        <div>
          <label>Master Password</label>
          <input type='password' value={masterPasswordInput} onChange={(e)=>{handleInputChange('masterPassword',e.target.value)}} />
        </div>
        <div>
          <label>Master Password (again)</label>
          <input type='password' value={masterPasswordConfirmInput} onChange={(e)=>{handleInputChange('confirmMasterPassword',e.target.value)}} />
        </div>
        <button type='button' onClick={()=>{handleSubmit()}}>Submit</button>
      </form>
    </div>
  )
}