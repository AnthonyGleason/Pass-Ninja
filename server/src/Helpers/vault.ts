import { demoPassMaxLength, demoPassMinLength, demoPassNickName, demoPassSiteUrl, demoPassUseNumbers, demoPassUseSpecialChars, demoPassUseUpperCases, demoPassUserName, tokenExpireTime } from "../Configs/auth";
import { createPasswordEntry } from "../Controllers/password";
import { encryptPassword } from "./auth";

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
  };
  return password;
};

export const createExamplePassword = async function(
  vaultID:string,
  masterPassword:string
){
  //create a password for the demo password entry
  const tempEncryptedPass:string = encryptPassword(
    generatePassword(
      demoPassMinLength,
      demoPassMaxLength,
      demoPassUseSpecialChars,
      demoPassUseUpperCases,
      demoPassUseNumbers,
    ),
    masterPassword
  );
  //create the demo password's notes encrypted with the user's master password
  const tempEncryptedNotes:string = encryptPassword('Thank you for trying Pass Ninja!', masterPassword);

  if (vaultID) await createPasswordEntry(
      vaultID,
      demoPassUserName,
      tempEncryptedPass,
      demoPassNickName,
      demoPassSiteUrl,
      tempEncryptedNotes
    );
};