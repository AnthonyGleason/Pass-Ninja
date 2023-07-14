import { customRequest } from "../interfaces/interfaces";
import { Response,NextFunction } from "express";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cryptoJS from 'crypto-js';

//encrypt the password using the masterPassword
export const encryptPassword = function(password: string, masterPassword: string): string {
  return cryptoJS.AES.encrypt(password, masterPassword).toString();
};

//decrypt the password will be used on client
export const decryptPassword = function(encryptedPassword: string, masterPassword: string): string {
  const decryptedBytes = cryptoJS.AES.decrypt(encryptedPassword, masterPassword);
  return decryptedBytes.toString(cryptoJS.enc.Utf8);
};

//issue jwt tokens
export const issueToken = function(user:any, vault:any){
  return jwt.sign({
    user: user,
    vault: vault,
  },process.env.SECRET as jwt.Secret);
};

//authenticates jwt tokens
export const authenticateToken = function(req:customRequest, res:Response, next:NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  //handle token does not exist or token is revoked
  if (!token || invalidatedTokens.includes(token)) {
    return res.status(401).json({ error: 'Unauthorized' });
  };
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as jwt.Secret, (err:any, payload:any) => {
    if (err) {
      return res.status(403).json({ error: 'Forbidden' });
    };
    //payload is assigned in the request for use in routes by accessing req.payload
    req.payload = payload;
    req.token = token;
    next();
  });
};

//String is set to lowercase here as the password argument type because bcrypt is St
export const generateHashedPassword = async function(password:string){ 
  //generate hashed password
  const salt = await bcrypt.genSalt(16);
  return await bcrypt.hash(password,salt);
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
//invalidated jwt tokens will be added to this array (in the future i could create a document on mongoDB for invalidated tokens)
export const invalidatedTokens: String[] = [];