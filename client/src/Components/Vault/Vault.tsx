import React, { useEffect, useState } from 'react';
import cryptoJS from 'crypto-js';
import { v4 as uuidGen } from 'uuid';
import { VaultBrowser } from '../../Classes/VaultBrowser';

export default function VaultComponent({vaultBrowser}:{vaultBrowser:VaultBrowser}){
  const [passwords,setPasswords] = useState(vaultBrowser.passwords);
  //create the input states in the vault class
  const [nickNameInput,setNickNameInput] = useState<string>('');
  const [siteUrlInput, setSiteUrlInput] = useState<string>('');
  const [userNameInput, setUserNameInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [minLengthInput, setMinLengthInput] = useState<number>(35);
  const [maxLengthInput, setMaxLengthInput] = useState<number>(50);
  const [upperCasesInput, setUpperCasesInput] = useState<boolean>(true);
  const [numbersInput, setNumbersInput] = useState<boolean>(true);
  const [specialCharsInput, setSpecialCharsInput] = useState<boolean>(true);
  const [selectedUrlOption, setSelectedUrlOption] = useState<string>('https://');

  useEffect(()=>{
    getAndSetPasswords();
  },[]);

  useEffect(()=>{
    setPasswordInput(generatePassword(
      minLengthInput,
      maxLengthInput,
      specialCharsInput,
      upperCasesInput,
      numbersInput
    ));
  },[minLengthInput,maxLengthInput,specialCharsInput,upperCasesInput,numbersInput]);

  const handleInputChange = function(field:string,updatedVal:string){
    switch (field){
      case 'nickName':
        setNickNameInput(updatedVal);
        break;
      case 'siteUrl':
        setSiteUrlInput(updatedVal);
        break;
      case 'userName':
        setUserNameInput(updatedVal);
        break;
      case 'password':
        setPasswordInput(updatedVal);
        break;
    };
  };
  const handleCreateNewPassword = async function(){
    const response = await fetch('http://localhost:5000/v1/api/vaults/passwords',{
      method: 'POST',
      headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
      },
      body: JSON.stringify({
        nickName: nickNameInput,
        siteUrl:  selectedUrlOption+siteUrlInput,
        userName: userNameInput,
        encryptedPassword: encryptPassword(passwordInput,vaultBrowser.masterPassword),
      }),
    });
    const responseData = await response.json();
    await getAndSetPasswords();
  };
  
  const handlePasswordParamChange = function (field:string,updatedVal?:number){
    switch(field){
      case 'minLength':
        if (typeof updatedVal==='number') setMinLengthInput(updatedVal);
        if (minLengthInput>maxLengthInput && maxLengthInput+1<70) setMaxLengthInput(minLengthInput+1);
        break;
      case 'maxLength':
        if (typeof updatedVal==='number') setMaxLengthInput(updatedVal);
        break;
      case 'upperCases':
        upperCasesInput === true ? setUpperCasesInput(false) : setUpperCasesInput(true);
        break;
      case 'specialChars':
        specialCharsInput === true ? setSpecialCharsInput(false) : setSpecialCharsInput(true);
        break;
      case 'numbers':
        numbersInput === true ? setNumbersInput(false) : setNumbersInput(true);
        break;
    };
  };
  const getAndSetPasswords = async function(){
    await fetch(`http://localhost:5000/v1/api/vaults/passwords/`,{
      method: 'GET',
      headers:{
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
      }
    })
    .then(async (responseData:any)=>{
      //decrypt passwords
      const data = await responseData.json();
      let passwords: any[] = data.passwords;
      passwords.forEach((password:any)=>{
        if (!password.encryptedPassword) return;
        password.decryptedPassword=decryptPassword(password.encryptedPassword,vaultBrowser.masterPassword);
      });
      setPasswords(passwords);
    });
  };
  const handleDeletePassword = async function(passwordID:string){
    const response = await fetch(`http://localhost:5000/v1/api/vaults/passwords/${passwordID}`,{
      method: 'DELETE',
      headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
      }
    });
    //refresh passwords
    await getAndSetPasswords();
  };

  return(
    <div className='vault'>
      <form method='POST' action='http://localhost:5000/api/v1/vaults/passwords'>
        <h3>New Password</h3>
        <div>
          <label>Nickname</label>
          <input value={nickNameInput} onChange={(e)=>{handleInputChange('nickName',e.target.value)}} />
        </div>
        <div>
          <label>Web Address</label>
          <select value={selectedUrlOption} onChange={(e)=>{setSelectedUrlOption(e.target.value)}} >
            <option>https://www.</option>
            <option>http://www.</option>
          </select>
          <input value={siteUrlInput} onChange={(e)=>{handleInputChange('siteUrl',e.target.value)}} />
        </div>
        <div>
          <label>Username</label>
          <input value={userNameInput} onChange={(e)=>{handleInputChange('userName',e.target.value)}} />
        </div>
        <div>
          <label>Password</label>
          <input value={passwordInput} onChange={(e)=>{handleInputChange('password',e.target.value)}} />
        </div>
        <button type='button' onClick={()=>{handleCreateNewPassword()}}>Create New Password</button>
      </form>
      <form>
        <h3>Secure Password Generator</h3>
        <div>
          <p>Min Length: {minLengthInput} Characters</p>
          <input type="range" min="1" max="70" value={minLengthInput} onChange={(e)=>{handlePasswordParamChange('minLength',parseInt(e.target.value)) }} />
        </div>
        <div>
          <p>Max Length: {maxLengthInput} Characters</p>
          <input type="range" min="1" max="70" value={maxLengthInput} onChange={(e)=>{handlePasswordParamChange('maxLength',parseInt(e.target.value)) }} />
        </div>
        <div>
          <p>UpperCases</p>
          <input type='checkbox' onChange={()=>{handlePasswordParamChange('upperCases')}} checked={upperCasesInput} />
        </div>
        <div>
          <p>Special Characters</p>
          <input type='checkbox' onChange={()=>{handlePasswordParamChange('specialChars')}} checked={specialCharsInput} />
        </div>
        <div>
          <p>Numbers</p>
          <input type='checkbox' onChange={()=>{handlePasswordParamChange('numbers')}} checked={numbersInput} />
        </div>
        <button type='button' onClick={()=>{setPasswordInput(generatePassword(minLengthInput,maxLengthInput,specialCharsInput,upperCasesInput,numbersInput))}}>Regenerate Password</button>
      </form>

      {
        passwords.map((password)=>{
          return(
            <div key={uuidGen()}>
              <p>Nickname: {password.nickName}</p>
              <p>Site Url: <a href={`${password.siteUrl}`}>{password.siteUrl}</a></p>
              <p>Username: {password.userName}</p>
              {/* Note: .decryptedPassword property is created when passwords are decrypted during login */}
              <p>Password: {password.decryptedPassword}</p> 
              <button onClick={()=>{handleDeletePassword(password._id)}}>Delete</button>
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

//generate a secure password
export const generatePassword = function(minLength:number,maxLength:number,specialChars:boolean,upperCases:boolean,numbers:boolean){
  //define character sets
  const lowerCaseCharsSet = 'abcdefghijklmnopqrstuvwxyz';
  const specialCharsSet = '!@#$%^&*()_+{}:"<>?|';
  const upperCaseCharsSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbersSet = '0123456789';
  const getRandomInt = function(min:number,max:number){
    return Math.floor(Math.random()*(max-min+1))+min;
  }
  // Initialize the character pool with lowercase characters
  let charPool = lowerCaseCharsSet;
  // Add character sets to the pool based on user constraints
  if (specialChars) {
    charPool += specialCharsSet;
  };
  if (upperCases) {
    charPool += upperCaseCharsSet;
  };
  if (numbers) {
    charPool += numbersSet;
  };
  // Generate a random password length within the user provided range
  const passwordLength = getRandomInt(minLength,maxLength);
  // Generate the secure password by getting random characters from the charPool;
  let password = '';
  for (let i = 0; i < passwordLength; i++) {
    const randomIndex = getRandomInt(0, charPool.length - 1); //get a ran
    password += charPool.charAt(randomIndex);
  }
  return password;
};