import bcrypt, { genSalt } from "bcrypt";
import { createVault, getVaultByUserEmail } from "../Controllers/vault";
import jwt from 'jsonwebtoken';
import { vaultDoc } from '../Interfaces/interfaces';
import cryptoJS from 'crypto-js';
import { loginTokenExpireTime } from "../Configs/auth";

export const generateHashedPassword = async function(password:string):Promise<string>{ 
  //generate hashed password
  const salt = await bcrypt.genSalt(15);
  const hashedPassword:string = await bcrypt.hash(password,salt);
  return hashedPassword;
};

export const loginExistingUser = async function(
  email:string,
  masterPassword:string,
):Promise<string>{
  //get user's vault by email
  const vault:vaultDoc | null = await getVaultByUserEmail(email);

  //verify the user has a vault with a master password present
  if (
    vault===null || //vault is not found
    !vault.hashedMasterPassword //verify a hashed master password is present
  ) throw new Error(`Error retrieving vault data for user with email ${email}`);

  //compare the hashed password to the provided password using bcrypt, if it matches the hash return a token with the vault as the payload
  if (await bcrypt.compare(masterPassword,vault.hashedMasterPassword)) return issueToken(vault);

  return ''; // user was not logged in
};


export const registerNewUser = async function(
  masterPassword:string,
  masterPasswordConfirm:string,
  firstName:string,
  lastName:string,
  email:string,
  ):Promise<vaultDoc | void>{
  
  if (
    masterPassword===masterPasswordConfirm && //master password and the password confirmation inputs match
    firstName && // a first name was provided
    lastName && // a last name was provided
    await isEmailAvailable(email) // the email is not taken
    ){
    //hash the masterPassword
    const salt = await genSalt(15);
    const hashedMasterPassword = await bcrypt.hash(masterPassword,salt);
    //create a new vault in mongodb for the user
    return await createVault(firstName,lastName,email,hashedMasterPassword) as vaultDoc;
  }
};

export const isEmailAvailable = async function(
  email:string,
):Promise<boolean>{
  const vault:vaultDoc | null = await getVaultByUserEmail(email);
  if (vault) return true; //vault is found, a vault exists with that email address
  return false; //otherwise a vault is not found and that email address is available
};

//encrypt the password using the masterPassword
export const encryptPassword = function(password: string, masterPassword: string): string {
  return cryptoJS.AES.encrypt(password, masterPassword).toString();
};

//decrypt the password with provided masterpassword
export const decryptPassword = function(encryptedPassword: string, masterPassword: string): string {
  const decryptedBytes = cryptoJS.AES.decrypt(encryptedPassword, masterPassword);
  return decryptedBytes.toString(cryptoJS.enc.Utf8);
};

//issue jwt login tokens
export const issueToken = function(vault:vaultDoc){
  //returns a jwt token for the user session containing a payload with the users vault
  return jwt.sign({
    vault: vault
  },
    process.env.SECRET as jwt.Secret,
  {
    expiresIn: loginTokenExpireTime
  });
};

export const doesUserHasTwoFactorEnabled = async function(email:string):Promise<boolean>{
  const vault:vaultDoc | null = await getVaultByUserEmail(email);
  if (
    vault && //vault exists
    vault.twoFactorAuthSecret!=='' //the vault's two factor secret is not an empty string (user has two factor enabled)
  ) return true;
  return false;
};

//invalidated jwt tokens will be added to this array, tokens will expire in 1 hour from issue so there is no need for a long term invalidatedTokens document in mongoDB or similar.
export let invalidatedTokens: String[] = [];

//holds currently pending vertification 2fa tokens
export let twoFactorPendingTokens: any[] = [];