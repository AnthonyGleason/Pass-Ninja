import bcrypt, { genSalt } from "bcrypt";
import { createVault, getVaultByUserEmail } from "../Controllers/vault";
import jwt from 'jsonwebtoken';
import { vaultDoc } from '../Interfaces/interfaces';
import cryptoJS from 'crypto-js';
import { tokenExpireTime } from "../Configs/auth";

//String is set to lowercase here as the password argument type because bcrypt is St
export const generateHashedPassword = async function(password:string):Promise<string>{ 
  //generate hashed password
  const salt = await bcrypt.genSalt(16);
  const hashedPassword:string = await bcrypt.hash(password,salt);
  return hashedPassword;
};

export const loginExistingUser = async function(
  email:string,
  masterPassword:string,
):Promise<string>{
  console.log(email,masterPassword);
  //get user's vault by email
  const vault:vaultDoc | null = await getVaultByUserEmail(email);
  if (vault===null || !vault.hashedMasterPassword) throw new Error('Error retrieving vault data.');
  //compare the hashed password to the provided password using bcrypt
  if (await bcrypt.compare(masterPassword,vault.hashedMasterPassword)){
    //if passwords match issue the client a token
    const token = issueToken(vault);
    return token;
  }else{
    return '';
  }
};

export const registerNewUser = async function(
  masterPassword:string,
  masterPasswordConfirm:string,
  firstName:string,
  lastName:string,
  email:string,
  ):Promise<vaultDoc | void>{
  //passwords must match and the firstName and lastName properties must be set, email must be unique
  if (masterPassword===masterPasswordConfirm && firstName && lastName && await isEmailAvailable(email)){
    //hash the masterPassword
    const salt = await genSalt(15);
    const hashedMasterPassword = await bcrypt.hash(masterPassword,salt);
    //create a new vault in mongodb for the user
    const vault = await createVault(firstName,lastName,email,hashedMasterPassword) as vaultDoc;
    return vault;
  }
};

export const isEmailAvailable = async function(
  email:string,
):Promise<boolean>{
  const vault:vaultDoc | null = await getVaultByUserEmail(email);
  if (vault){
    return false;
  }else{
    return true;
  }
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
//issue jwt tokens
export const issueToken = function(vault:vaultDoc){
  return jwt.sign({
    vault: vault,
  },
  process.env.SECRET as jwt.Secret
  ,{
    // for testing tokens will expire in 1 day from issue time
    //in the future this will need to be something more like 5-10 minutes to protect users from stolen jwt tokens and will display a session has expired error please login again if the user tries to access anything with an expired token.
    expiresIn: tokenExpireTime,
  });
};

//invalidated jwt tokens will be added to this array, tokens will expire in 5-10 minutes from issue so there is no need for a long term invalidatedTokens document in mongoDB or similar.
export const invalidatedTokens: String[] = [];