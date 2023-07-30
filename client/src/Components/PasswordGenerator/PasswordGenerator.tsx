import React,{useState,useEffect} from 'react';

export default function PasswordGenerator(){
  const [minLengthInput, setMinLengthInput] = useState<number>(35);
  const [maxLengthInput, setMaxLengthInput] = useState<number>(50);
  const [upperCasesInput, setUpperCasesInput] = useState<boolean>(true);
  const [numbersInput, setNumbersInput] = useState<boolean>(true);
  const [specialCharsInput, setSpecialCharsInput] = useState<boolean>(true);
  const [genPasswordInput, setGenPasswordInput] = useState<string>('');

  //if any of the password generator's input states are adjusted a new password will be generated within the updated constraints
  useEffect(()=>{
    setGenPasswordInput(
      generatePassword(
        minLengthInput,
        maxLengthInput,
        specialCharsInput,
        upperCasesInput,
        numbersInput
      )
    );
  },[minLengthInput,maxLengthInput,specialCharsInput,upperCasesInput,numbersInput]);
  
  //generate a secure password
  const generatePassword = function(
    minLength:number,
    maxLength:number,
    genSpecialChars:boolean,
    genUpperCases:boolean,
    genNumbers:boolean
  ){
    //define character sets
    const lowerCaseCharsSet = 'abcdefghijklmnopqrstuvwxyz';
    const specialCharsSet = '!@#$%^&*()_+{}:"<>?|';
    const upperCaseCharsSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbersSet = '0123456789';
    const getRandomInt = function(min:number,max:number){
        return Math.floor(Math.random()*(max-min+1))+min;
    };
    // Initialize the character pool with lowercase characters
    let charPool = lowerCaseCharsSet;
    // Add character sets to the pool based on user constraints
    if (genSpecialChars) charPool += specialCharsSet;
    if (genUpperCases) charPool += upperCaseCharsSet;
    if (genNumbers) charPool += numbersSet;
    // Generate a random password length within the user provided range
    const passwordLength = getRandomInt(minLength,maxLength);
    // Generate the secure password by getting random characters from the character pool
    let password = '';
    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = getRandomInt(0, charPool.length - 1); //get a random character from the character pool;
      password += charPool.charAt(randomIndex);
    }
    return password;
  };

  const handlePasswordParamChange = function (field:string,updatedVal:number){
    switch(field){
      case 'minLength':
        //break if the minLength is going to be greater than the max length input
        if (updatedVal>maxLengthInput) break;
        setMinLengthInput(updatedVal);
        break;
      case 'maxLength':
        //break if the maxLength is going to be less than the min length input
        if (updatedVal<minLengthInput) break;
        setMaxLengthInput(updatedVal);
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

  return(
    <form>
      <h3>Secure Password Generator</h3>
      <div>
        <input value={genPasswordInput} onChange={(e)=>{setGenPasswordInput(e.target.value)}}></input>
        <button type='button' onClick={()=>{setGenPasswordInput(generatePassword(minLengthInput,maxLengthInput,specialCharsInput,upperCasesInput,numbersInput))}}>Regenerate Password</button>
      </div>
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
        <input type='checkbox' onChange={()=>{handlePasswordParamChange('upperCases',0)}} checked={upperCasesInput} />
      </div>
      <div>
        <p>Special Characters</p>
        <input type='checkbox' onChange={()=>{handlePasswordParamChange('specialChars',0)}} checked={specialCharsInput} />
      </div>
      <div>
        <p>Numbers</p>
        <input type='checkbox' onChange={()=>{handlePasswordParamChange('numbers',0)}} checked={numbersInput} />
      </div>
    </form>
  );
};