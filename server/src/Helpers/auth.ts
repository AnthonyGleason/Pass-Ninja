import bcrypt from 'bcrypt';
import cryptoJS from 'crypto-js';

//String is set to lowercase here as the password argument type because bcrypt is St
export const generateHashedPassword = async function(password:string):Promise<string>{ 
  //generate hashed password
  const salt = await bcrypt.genSalt(16);
  const hashedPassword:string = await bcrypt.hash(password,salt);
  return hashedPassword;
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

/* 

  after sign in user will use these to decrypt the other passwords. has to be used on client!!!

*/

//encrypt the password using the masterPassword
export const encryptPassword = function(password: string, masterPassword: string): string {
  return cryptoJS.AES.encrypt(password, masterPassword).toString();
};

//decrypt the password will be used on client
export const decryptPassword = function(encryptedPassword: string, masterPassword: string): string {
  const decryptedBytes = cryptoJS.AES.decrypt(encryptedPassword, masterPassword);
  return decryptedBytes.toString(cryptoJS.enc.Utf8);
};