import React, {useState} from 'react';

export default function Login(){
  const [emailInput,setEmailInput] = useState<string>();
  const [passwordInput,setPasswordInput] = useState<string>();

  const handleSubmit = async function(){
    const response = await fetch('http://localhost:5000/v1/api/vaults/login',{
      method: 'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: emailInput,
        password: passwordInput,
      }),
    });
    const responseData = await response.json();
    localStorage.setItem('jwt',responseData.token);
  };

  return(
    <div className='login'>
      <form>
        <div>
          <label>Email</label>
          <input type='email' onChange={(e)=>{setEmailInput(e.target.value)}} />
        </div>
        <div>
          <label>Password</label>
          <input type='password' onChange={(e)=>{setPasswordInput(e.target.value)}} />
        </div>
        <button type='button' onClick={()=>{handleSubmit()}}>Submit</button>
      </form>
    </div>
  )
}
