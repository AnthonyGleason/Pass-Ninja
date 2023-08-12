import React,{useState,useEffect} from 'react';
import './PasswordGenerator.css';
import { PasswordScore } from '../../Classes/PasswordScore';
import PasswordScoreTable from '../PasswordScoreTable/PasswordScoreTable';
import Tooltip from '../Tooltip/Tooltip';

export default function PasswordGenerator({setPasswordInput}:{setPasswordInput:Function}){
  const [minLengthInput, setMinLengthInput] = useState<number>(15);
  const [maxLengthInput, setMaxLengthInput] = useState<number>(20);
  const [lowerCasesInput, setLowerCasesInput] = useState<boolean>(true);
  const [upperCasesInput, setUpperCasesInput] = useState<boolean>(true);
  const [numbersInput, setNumbersInput] = useState<boolean>(true);
  const [specialCharsInput, setSpecialCharsInput] = useState<boolean>(true);
  const [genPasswordInput, setGenPasswordInput] = useState<string>('');
  const [isPassGeneratorOpen, setIsPassGeneratorOpen] = useState<boolean>(false);
  const [activeTooltipTerm, setActiveTooltipTerm] = useState<string>('');

  //define character sets
  const lowerCaseCharsSet = 'abcdefghijklmnopqrstuvwxyz';
  const specialCharsSet = '!@#$%^&*()_+{}:"<>?|';
  const upperCaseCharsSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbersSet = '0123456789';

  const updateCharPool = function():string{
    let newCharPool = '';
    // Add character sets to the pool based on user constraints
    if (lowerCasesInput) newCharPool += lowerCaseCharsSet;
    if (specialCharsInput) newCharPool += specialCharsSet;
    if (upperCasesInput) newCharPool += upperCaseCharsSet;
    if (numbersInput) newCharPool += numbersSet;
    // Handle instances where the user unchecks all boxes (which shouldnt be allowed because handlePasswordParamChange verifies at least one box is checked)
    if (!newCharPool){
      newCharPool = lowerCaseCharsSet;
      setLowerCasesInput(true);
    };
    return newCharPool;
  };
  let charPool = updateCharPool();
  const [passwordScore, setPasswordScore] = useState<PasswordScore>(new PasswordScore(genPasswordInput,charPool.length));
  
  //if any of the password generator's input states are adjusted a new password will be generated within the updated constraints
  useEffect(()=>{
    //generate a random password
    const generatedPassword:string = generatePassword();
    //set the password in state so the user sees it
    setGenPasswordInput(generatedPassword);
  },[minLengthInput,maxLengthInput,specialCharsInput,lowerCasesInput,upperCasesInput,numbersInput]);

  //score the password when a the password input is modified (user will see realtime password scores)
  useEffect(()=>{
    const passwordScore:PasswordScore = new PasswordScore(genPasswordInput,charPool.length);
    setPasswordScore(passwordScore);
    //update the accent color of the strength bar
    const strengthBarElement:any  = document.querySelector('.password-entropy-input');
    if (strengthBarElement) strengthBarElement.style.accentColor=passwordScore.colorCode;
  },[genPasswordInput]);

  //generate a secure password
  const generatePassword = function(){
    const getRandomInt = function(min:number,max:number){
        return Math.floor(Math.random()*(max-min+1))+min;
    };
    // Generate a random password length within the user provided range
    const passwordLength = getRandomInt(minLengthInput,maxLengthInput);
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
        // if the new min length value is greater than the max length then update both the min and max length so they are the same. 
        if (updatedVal>maxLengthInput){
          setMaxLengthInput(updatedVal);
          setMinLengthInput(updatedVal);
        }else{
          // if the new min length is less than or equal to the max value it is a valid change and can be applied
          setMinLengthInput(updatedVal);
        }
        break;
      case 'maxLength':
        if (updatedVal<minLengthInput){
          setMaxLengthInput(updatedVal);
          setMinLengthInput(updatedVal);
        }else{
          setMaxLengthInput(updatedVal);
        }
        break;
      case 'lowerCases':
        //if all other inputs are unchecked break (one char set must be enabled for password generation)
        if (!upperCasesInput && !specialCharsInput && !numbersInput) break;
        lowerCasesInput === true ? setLowerCasesInput(false) : setLowerCasesInput(true);
        break;
      case 'upperCases':
        //if all other inputs are unchecked break (one char set must be enabled for password generation)
        if (!lowerCasesInput && !specialCharsInput && !numbersInput) break;
        upperCasesInput === true ? setUpperCasesInput(false) : setUpperCasesInput(true);
        break;
      case 'specialChars':
        //if all other inputs are unchecked break (one char set must be enabled for password generation)
        if (!upperCasesInput && !lowerCasesInput && !numbersInput) break;
        specialCharsInput === true ? setSpecialCharsInput(false) : setSpecialCharsInput(true);
        break;
      case 'numbers':
        //if all other inputs are unchecked break (one char set must be enabled for password generation)
        if (!upperCasesInput && !specialCharsInput && !lowerCasesInput) break;
        numbersInput === true ? setNumbersInput(false) : setNumbersInput(true);
        break;
    };
  };

  if (isPassGeneratorOpen){
    return(
      <div className='pass-gen-menu'>
        <h3 className='drop-down-menu' onClick={()=>{setIsPassGeneratorOpen(false)}}>
          <p>Secure Password Generator</p>
        </h3>
        <div className='pass-gen'>
          <div className='pass-gen-output'>
            <h4>Generated Password:</h4>
            <input className='gen-password-input' value={genPasswordInput} onChange={(e)=>{setGenPasswordInput(e.target.value)}} />
            <div className='gen-password-button-container'>
              <button type='button' onClick={()=>{setGenPasswordInput(generatePassword())}}>Regenerate Password</button>
              <button type='button' onClick={()=>{setPasswordInput(genPasswordInput)}}>Use Password</button>
            </div>
          </div>
          <div className='pass-gen-settings'>
            <h4>Generation Settings:</h4>
            <div className='pass-gen-setting'>
              <Tooltip activeTooltipTerm={activeTooltipTerm} setActiveTooltipTerm={setActiveTooltipTerm} term='Min Length' desc='Changing this input modifies the minimum amount of characters a newly generated password could have.' /> {minLengthInput}
              <input type="range" min="1" max="70" value={minLengthInput} onChange={(e)=>{handlePasswordParamChange('minLength',parseInt(e.target.value)) }} />
            </div>
            <div className='pass-gen-setting'>
              <Tooltip activeTooltipTerm={activeTooltipTerm} setActiveTooltipTerm={setActiveTooltipTerm} term='Max Length' desc='Changing this input modifies the maximum amount of characters a newly generated password could have.' /> {maxLengthInput}
              <input type="range" min="1" max="70" value={maxLengthInput} onChange={(e)=>{handlePasswordParamChange('maxLength',parseInt(e.target.value)) }} />
            </div>
            <div className='pass-gen-setting'>
              <Tooltip activeTooltipTerm={activeTooltipTerm} setActiveTooltipTerm={setActiveTooltipTerm} term='Generate LowerCases' desc='Checking this box allows the password generator to generate lowercase characters in new passwords.' />
              <input className='checkbox' type='checkbox' onChange={()=>{handlePasswordParamChange('lowerCases',0)}} checked={lowerCasesInput} />
            </div>
            <div className='pass-gen-setting'>
              <Tooltip activeTooltipTerm={activeTooltipTerm} setActiveTooltipTerm={setActiveTooltipTerm} term='Generate UpperCases' desc='Checking this box allows the password generator to generate uppercase characters in new passwords.' />
              <input className='checkbox' type='checkbox' onChange={()=>{handlePasswordParamChange('upperCases',0)}} checked={upperCasesInput} />
            </div>
            <div className='pass-gen-setting'>
              <Tooltip activeTooltipTerm={activeTooltipTerm} setActiveTooltipTerm={setActiveTooltipTerm} term='Generate Special Characters' desc='Checking this box allows the password generator to generate special characters in new passwords.' />
              <input className='checkbox' type='checkbox' onChange={()=>{handlePasswordParamChange('specialChars',0)}} checked={specialCharsInput} />
            </div>
            <div className='pass-gen-setting'>
              <Tooltip activeTooltipTerm={activeTooltipTerm} setActiveTooltipTerm={setActiveTooltipTerm} term='Generate Numbers' desc='Checking this box allows the password generator to generate numbers in new passwords.' />
              <input className='checkbox' type='checkbox' onChange={()=>{handlePasswordParamChange('numbers',0)}} checked={numbersInput} />
            </div>
            <div className='pass-gen-char-pool-info'>
              There are <b>{charPool.length}</b> characters currently in the&nbsp;
              <Tooltip activeTooltipTerm={activeTooltipTerm} setActiveTooltipTerm={setActiveTooltipTerm} term='character pool' desc={`The character pool is the collection of possible characters the password generator can pick from when generating new passwords. The password generator in which this tooltip has been opened has a character pool of ${charPool.length} that consists of the characters: ${charPool}`} />.
            </div>
            <p>(Hint: Press on any underlined text to learn more!)</p>
          </div>
          <div className='pass-gen-info'>
            <h4>How Are Passwords Rated?</h4>
            <PasswordScoreTable />
            <input className='password-entropy-input' type="range" min='0' max='150' value={passwordScore.entropyInBits} readOnly />
            <div className='pass-gen-score'>
              The currently generated password is <b>{passwordScore.strength}</b>.
              This password has a <Tooltip activeTooltipTerm={activeTooltipTerm} setActiveTooltipTerm={setActiveTooltipTerm} term='calculated entropy' desc='Passwords are calculated using the algorithm, log2(length of the possible characters pool ^ length of the password) = entropy in bits.' /> of <b>{passwordScore.entropyInBits}</b> bits and an&nbsp;
              <Tooltip activeTooltipTerm={activeTooltipTerm} setActiveTooltipTerm={setActiveTooltipTerm} term='approximate crack time' desc="Attacker's skill and computing power can influence the password cracking speed causing faster or slower password cracking times." /> of <b>{passwordScore.estCrackTime}</b>.
            </div>
          </div>
        </div>
      </div>
    );
  }else{
    return(
      <div className='pass-gen-menu'>
        <h3 className='drop-down-menu' onClick={()=>{setIsPassGeneratorOpen(true)}}>
          <p>Secure Password Generator</p>
        </h3>
      </div>
    );
  };
};