import React,{useState,useEffect} from 'react';
import './PasswordGenerator.css';
import { PasswordScore } from '../../Classes/PasswordScore';
import PasswordScoreTable from '../PasswordScoreTable/PasswordScoreTable';
import Tooltip from '../Tooltip/Tooltip';

export default function PasswordGenerator({setPasswordInput}:{setPasswordInput:Function}){
  const [minLengthInput, setMinLengthInput] = useState<number>(15);
  const [maxLengthInput, setMaxLengthInput] = useState<number>(20);
  const [upperCasesInput, setUpperCasesInput] = useState<boolean>(true);
  const [numbersInput, setNumbersInput] = useState<boolean>(true);
  const [specialCharsInput, setSpecialCharsInput] = useState<boolean>(true);
  const [genPasswordInput, setGenPasswordInput] = useState<string>('');
  const [isPassGeneratorOpen, setIsPassGeneratorOpen] = useState<boolean>(false);
  //define character sets
  const lowerCaseCharsSet = 'abcdefghijklmnopqrstuvwxyz';
  const specialCharsSet = '!@#$%^&*()_+{}:"<>?|';
  const upperCaseCharsSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbersSet = '0123456789';
  const updateCharPool = function():string{
    let newCharPool = lowerCaseCharsSet;
    // Add character sets to the pool based on user constraints
    if (specialCharsInput) newCharPool += specialCharsSet;
    if (upperCasesInput) newCharPool += upperCaseCharsSet;
    if (numbersInput) newCharPool += numbersSet;
    //set the new char pool
    return newCharPool;
  };
  let charPool = updateCharPool();
  const [passwordScore, setPasswordScore] = useState<PasswordScore>(new PasswordScore(genPasswordInput,charPool.length));
  
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

  //score the password
  useEffect(()=>{
    const passwordScore:PasswordScore = new PasswordScore(genPasswordInput,charPool.length);
    setPasswordScore(passwordScore);
    //update the accent color of the strength bar
    const strengthBarElement:any  = document.querySelector('.password-entropy-input');
    if (strengthBarElement) strengthBarElement.style.accentColor=passwordScore.color;
  },[genPasswordInput]);

  //generate a secure password
  const generatePassword = function(
    minLength:number,
    maxLength:number,
    genSpecialChars:boolean,
    genUpperCases:boolean,
    genNumbers:boolean
  ){
    const getRandomInt = function(min:number,max:number){
        return Math.floor(Math.random()*(max-min+1))+min;
    };
    // Generate a random password length within the user provided range
    const passwordLength = getRandomInt(minLength,maxLength);
    // Generate the secure password by getting random characters from the character pool
    let password = '';
    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = getRandomInt(0, charPool.length - 1); //get a random character from the character pool;
      password += charPool.charAt(randomIndex);
    };
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
  
  //return a or an to keep the sentence gramatically correct
  const getStrengthPreceedingString = function():string{
    if (passwordScore.strength==='Extremely Strong'){
      return 'an';
    }else{
      return 'a';
    };
  };
  if (isPassGeneratorOpen){
    return(
      <div>
        <h3 onClick={()=>{setIsPassGeneratorOpen(false)}}><img alt='up arrow' />Secure Password Generator</h3>
        <PasswordScoreTable />
        <div>
          <input className='gen-password-input' value={genPasswordInput} onChange={(e)=>{setGenPasswordInput(e.target.value)}}></input>
        </div>
        <div>
          <button type='button' onClick={()=>{handleGeneratePassword()}}>Regenerate Password</button>
          <button type='button' onClick={()=>{setPasswordInput(genPasswordInput)}}>Use Password</button>
        </div>
        <div>
          <div>
            This password has a&nbsp;
            <Tooltip term='calculated entropy' desc='Passwords are calculated using the algorithm, log2(length of character pool ^ length of the password) = entropy in bits.' /> of <b>{passwordScore.entropy}</b> bits and an&nbsp;
            <Tooltip term='approximate crack time' desc="Attacker's skill and computing power can influence the password cracking speed causing faster or slower password cracking times." /> of <b>{passwordScore.crackTime}</b>. This is {getStrengthPreceedingString()} <b>{passwordScore.strength}</b> password.
          </div>
          <input className='password-entropy-input' type="range" min='0' max='150' value={passwordScore.entropy} readOnly />
        </div>
        <div>
          <Tooltip term='Min Length' desc='Changing this input modifies the minimum amount of characters a newly generated password could have.' /> {minLengthInput}
          <input type="range" min="1" max="70" value={minLengthInput} onChange={(e)=>{handlePasswordParamChange('minLength',parseInt(e.target.value)) }} />
        </div>
        <div>
          <Tooltip term='Max Length' desc='Changing this input modifies the maximum amount of characters a newly generated password could have.' /> {maxLengthInput}
          <input type="range" min="1" max="70" value={maxLengthInput} onChange={(e)=>{handlePasswordParamChange('maxLength',parseInt(e.target.value)) }} />
        </div>
        <div>
          <Tooltip term='Generate UpperCases' desc='Checking this box allows the password generator to generate uppercase characters in new passwords.' />
          <input type='checkbox' onChange={()=>{handlePasswordParamChange('upperCases',0)}} checked={upperCasesInput} />
        </div>
        <div>
          <Tooltip term='Generate Special Characters' desc='Checking this box allows the password generator to generate special characters in new passwords.' />
          <input type='checkbox' onChange={()=>{handlePasswordParamChange('specialChars',0)}} checked={specialCharsInput} />
        </div>
        <div>
          <Tooltip term='Generate Numbers' desc='Checking this box allows the password generator to generate numbers in new passwords.' />
          <input type='checkbox' onChange={()=>{handlePasswordParamChange('numbers',0)}} checked={numbersInput} />
        </div>
      </div>
    );
  }else{
    return(
      <h3 onClick={()=>{setIsPassGeneratorOpen(true)}}><img alt='drop down arrow' />Secure Password Generator</h3>
    )
  }
};