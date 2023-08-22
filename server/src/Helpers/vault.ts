import { demoPass } from "../Configs/auth";

import { createPasswordEntry } from "../Controllers/password";
import { encryptPassword } from "./auth";

//generate a secure password
export const generatePassword = function(minLength:number,maxLength:number,specialChars:boolean,upperCases:boolean,numbers:boolean){
  //define character sets
  const lowerCaseCharsSet = 'abcdefghijklmnopqrstuvwxyz';
  const specialCharsSet = '!@#$%^&*()_+{}:"<>?|';
  const upperCaseCharsSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbersSet = '0123456789';
  //initalize the generatedPassword array, each index will hold a single character
  let generatedPassword:string[] = [];
  //gets a random integer between the provided min and max values
  const getRandomInt = function(min:number,max:number){ return Math.floor(Math.random()*(max-min+1))+min }
  // Initialize the character pool with lowercase characters
  let charPool = lowerCaseCharsSet;
  // Add character sets to the pool based on user constraints
  if (specialChars) charPool += specialCharsSet; 
  if (upperCases) charPool += upperCaseCharsSet;
  if (numbers) charPool += numbersSet;
  // Generate a random password length within the user provided range
  const passwordLength = getRandomInt(minLength,maxLength);
  // Generate the secure password by getting random characters from the charPool
  for (let i = 0; i < passwordLength; i++) {
    //get a random index based on the length of the character pool
    const randomIndex = getRandomInt(0, charPool.length - 1); 
    //get a charcter from the character pool based on the random index generated and push that to the password array
    generatedPassword.push(charPool.charAt(randomIndex));
  };
  return generatedPassword.join('');
};

export const createExamplePassword = async function(
  vaultID:string,
  masterPassword:string
){
  //generate a password based on the demo pass object provided in the auth config
  const generatedPassword:string = generatePassword(
    demoPass.minLength,
    demoPass.maxLength,
    demoPass.useSpecialChars,
    demoPass.useUpperCases,
    demoPass.useNumbers,
  );

  //encrypt the demo password's password field
  const tempEncryptedPass:string = encryptPassword(generatedPassword,masterPassword);
  //encrypt the demo password's notes 
  const tempEncryptedNotes:string = encryptPassword(demoPass.notes, masterPassword);

  //create the password entry for the user with the vaultID provided
  await createPasswordEntry(
    vaultID,
    demoPass.userName,
    tempEncryptedPass,
    demoPass.nickName,
    demoPass.siteUrl,
    tempEncryptedNotes
  );
};