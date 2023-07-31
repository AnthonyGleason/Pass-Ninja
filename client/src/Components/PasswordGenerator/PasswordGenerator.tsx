import React,{useState,useEffect} from 'react';
import './PasswordGenerator.css';
export default function PasswordGenerator({setPasswordInput}:{setPasswordInput:Function}){
  const [minLengthInput, setMinLengthInput] = useState<number>(15);
  const [maxLengthInput, setMaxLengthInput] = useState<number>(20);
  const [upperCasesInput, setUpperCasesInput] = useState<boolean>(true);
  const [numbersInput, setNumbersInput] = useState<boolean>(true);
  const [specialCharsInput, setSpecialCharsInput] = useState<boolean>(true);
  const [genPasswordInput, setGenPasswordInput] = useState<string>('');
  const [passwordEntropy, setPasswordEntropy] = useState<number>(0);
  
  //if any of the password generator's input states are adjusted a new password will be generated within the updated constraints
  useEffect(()=>{
    //generate a random password
    const generatedPassword:string = generatePassword(
      minLengthInput,
      maxLengthInput,
      specialCharsInput,
      upperCasesInput,
      numbersInput
    );
    //set the password in state so the user sees it
    setGenPasswordInput(generatedPassword);
  },[minLengthInput,maxLengthInput,specialCharsInput,upperCasesInput,numbersInput]);
  
  //change the color of the bar according to the entropy level
  useEffect(()=>{
    const entropyInput:any = document.querySelector('.password-entropy-input');
    let color:string;
    // If-else statements to determine the appropriate color based on entropy level
    if (passwordEntropy >= 120) {
      color = 'blue'; // Extremely Strong
    } else if (passwordEntropy >= 100) {
      color = 'green'; // Very Strong
    } else if (passwordEntropy >= 80) {
      color = 'yellow'; // Strong
    } else if (passwordEntropy >= 60) {
      color = 'orange'; // Moderate
    } else if (passwordEntropy >= 40) {
      color = 'red'; // Weak
    }else{
      color = 'grey';
    }
    entropyInput.style.accentColor=color;
  },[passwordEntropy])

  const calculatePassEntropy = function(charSetLength:number, passLength:number):number {
    const passCombinations = BigInt(Math.pow(charSetLength, passLength));
    const passEntropyBits = Math.log2(Number(passCombinations));
    return passEntropyBits;
  }

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
    //calculate the passwords entropy measured in bits
    const passEntropyBits:number = calculatePassEntropy(charPool.length,password.length);
    //convert the password entropy to a hundreths place decimal
    setPasswordEntropy(parseFloat(passEntropyBits.toFixed(2)));
    return password;
  };

  const handlePasswordParamChange = function (field:string,updatedVal:number){
    switch(field){
      case 'minLength':
        //break if the minLength is going to be greater than the max length input
        if (updatedVal>maxLengthInput){
          setMaxLengthInput(updatedVal);
          setMinLengthInput(updatedVal);
        }
        setMinLengthInput(updatedVal);
        break;
      case 'maxLength':
        //break if the maxLength is going to be less than the min length input
        if (updatedVal<minLengthInput){
          setMaxLengthInput(updatedVal);
          setMinLengthInput(updatedVal);
        }
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

  const handleGeneratePassword = function():void{
    const generatedPassword:string = generatePassword(minLengthInput,maxLengthInput,specialCharsInput,upperCasesInput,numbersInput);
    setGenPasswordInput(generatedPassword);
  };

  const getPasswordEntropyKeyword = function() {
    if (passwordEntropy <= 39) {
      return 'Very Weak';
    } else if (passwordEntropy >= 40 && passwordEntropy <= 59) {
      return 'Weak';
    } else if (passwordEntropy >= 60 && passwordEntropy <= 79) {
      return 'Moderate';
    } else if (passwordEntropy >= 80 && passwordEntropy <= 99) {
      return 'Strong';
    } else if (passwordEntropy >= 100 && passwordEntropy <= 119) {
      return 'Very Strong';
    } else if (passwordEntropy >= 120) {
      return 'Extremely Strong';
    }
  };
  
  return(
    <form>
      <h3>Secure Password Generator</h3>
      <div>
        <input value={genPasswordInput} onChange={(e)=>{setGenPasswordInput(e.target.value)}}></input>
        <button type='button' onClick={()=>{handleGeneratePassword()}}>Regenerate Password</button>
        <button type='button' onClick={()=>{setPasswordInput(genPasswordInput)}}>Use Password</button>
      </div>
      <div>
        <p>Password Entropy: {passwordEntropy} bits</p>
        <p>This is a {getPasswordEntropyKeyword()} password.</p>
        <input className='password-entropy-input' type="range" min='0' max='150' value={passwordEntropy} readOnly />
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
        <p>Generate UpperCases</p>
        <input type='checkbox' onChange={()=>{handlePasswordParamChange('upperCases',0)}} checked={upperCasesInput} />
      </div>
      <div>
        <p>Generate Special Characters</p>
        <input type='checkbox' onChange={()=>{handlePasswordParamChange('specialChars',0)}} checked={specialCharsInput} />
      </div>
      <div>
        <p>Generate Numbers</p>
        <input type='checkbox' onChange={()=>{handlePasswordParamChange('numbers',0)}} checked={numbersInput} />
      </div>
      <h3>How Are Passwords Rated?</h3>
      <table>
        <thead>
          <tr>
            <th>Bits</th>
            <th>Strength</th>
            <th>Time to Crack</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>0-39</td>
            <td>Very Weak</td>
            <td>Instantly</td>
          </tr>
          <tr>
            <td>40-59</td>
            <td>Weak</td>
            <td>Minutes to Hours</td>
          </tr>
          <tr>
            <td>60-79</td>
            <td>Moderate</td>
            <td>Hours to Days</td>
          </tr>
          <tr>
            <td>80-99</td>
            <td>Strong</td>
            <td>Days to Weeks</td>
          </tr>
          <tr>
            <td>100-119</td>
            <td>Very Strong</td>
            <td>Months to Years</td>
          </tr>
          <tr>
            <td>120+</td>
            <td>Extremely Strong</td>
            <td>Millions of Years</td>
          </tr>
        </tbody>
      </table>
    </form>
  );
};