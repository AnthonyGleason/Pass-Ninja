import React, {useState} from 'react';

export default function Register(){
  const [firstNameInput,setFirstNameInput] = useState<string>();
  const [lastNameInput,setLastNameInput] = useState<string>();
  const [emailInput,setEmailInput] = useState<string>();
  const [masterPasswordInput,setMasterPasswordInput] = useState<string>();
  const [masterPasswordConfirmInput, setMasterPasswordConfirmInput] = useState<string>();

  const handleSubmit = async function(){
    const response = await fetch('http://localhost:5000/v1/api/vaults/register',{
      method: 'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName: firstNameInput,
        lastName: lastNameInput,
        email: emailInput,
        masterPassword: masterPasswordInput,
        masterPasswordConfirm: masterPasswordConfirmInput
      }),
    });
    const responseData = await response.json();
    localStorage.setItem('jwt',responseData.token);
  };

  return(
    <div className='register'>
      <form>
        <div>
          <label>First Name</label>
          <input type='text' onChange={(e)=>{setFirstNameInput(e.target.value)}} />
        </div>
        <div>
          <label>Last Name</label>
          <input type='text' onChange={(e)=>{setLastNameInput(e.target.value)}} />
        </div>
        <div>
          <label>Email</label>
          <input type='email' onChange={(e)=>{setEmailInput(e.target.value)}} />
        </div>
        <div>
          <label>Master Password</label>
          <input type='password' onChange={(e)=>{setMasterPasswordInput(e.target.value)}} />
        </div>
        <div>
          <label>Master Password (again)</label>
          <input type='password' onChange={(e)=>{setMasterPasswordConfirmInput(e.target.value)}} />
        </div>
        <button type='button' onClick={()=>{handleSubmit()}}>Submit</button>
      </form>
    </div>
  )
}