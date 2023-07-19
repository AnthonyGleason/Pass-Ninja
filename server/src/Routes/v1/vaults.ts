//    /v1/api/vaults/
//import type definitions
import { NextFunction, Response } from "express";
import { customRequest, vaultDoc} from '../../Interfaces/interfaces';
import express from "express";
import { passwordRouter } from "./passwords";
import { authenticateToken, invalidatedTokens, issueToken } from "../../Configs/auth";
import bcrypt, { genSalt } from 'bcrypt';
import { createVault, getVaultByUserEmail } from "../../Controllers/vault";
import { createPasswordEntry } from "../../Controllers/password";
import { encryptPassword, generatePassword } from "../../Helpers/auth";
import { token } from "morgan";

export const vaultsRouter = express.Router();

// • GET 	/api/v1/vaults/verify	verify the token provided
vaultsRouter.get('/verify', authenticateToken, (req:customRequest,res:Response,next:NextFunction)=>{
  res.status(200).json({
    isValid: true,
    message: 'The provided token has been successfully validated.',
  });
});

// • POST /api/v1/vaults/register create a new vault
vaultsRouter.post('/register',async (req:customRequest,res:Response,next:NextFunction)=>{
  const {
    firstName,
    lastName,
    email,
    masterPassword,
  }:{
    firstName: string,
    lastName: string,
    email:string,
    masterPassword:string,
  } = req.body;
  //hash the masterPassword
  const salt = await genSalt(15);
  const hashedMasterPassword:string = await bcrypt.hash(masterPassword,salt)
  //create a new vault in mongodb for the user
  const vault = await createVault(firstName,lastName,email,hashedMasterPassword);
  /*
    Create the demo password entry for the new vault.
    The password is encrypted using the users 'plain text' master password provided in the request
    so the user can decrypt it clientside later.
  */
  const tempUserName:string = 'demoUser';
  const tempEncryptedPass:string = encryptPassword(generatePassword(35,50,true,true,true),masterPassword)
  const tempSiteUrl:string  = 'https://www.anthonyinfortun.io';
  const tempNickName:string = 'Welcome to PassNinja'
  await createPasswordEntry(vault._id,tempUserName,tempEncryptedPass,tempNickName,tempSiteUrl); 
  //issue the client a token (so they do not need to login again)
  const token = issueToken(vault);
  //send the token and vault data to the client
  res.status(200).json({
    'token': token,
  });
});

// • POST	/api/v1/vaults/login	sign into already existing account 
vaultsRouter.post('/login', async (req:customRequest,res:Response,next:NextFunction)=>{
  //destructure the request body
  const {email, password}:{email:string, password:string} = req.body;
  //get user's vault by email
  const vault:vaultDoc | null = await getVaultByUserEmail(email);
  if (vault===null || !vault.hashedMasterPassword) throw new Error('Error retrieving vault data.');
  //compare the hashed password to the provided password using bcrypt
  if (await bcrypt.compare(password,vault.hashedMasterPassword)){
    //if passwords match issue the client a token and send a vault
    res.status(200).json({
      'token': token,
    });
  }else{
    //if they dont match send the client an unauthorized status code
    res.status(401).json({'message':'The entered password is incorrect'});
  };
});

// • POST	/api/v1/vaults/logout	log out of account invalidating the users token
vaultsRouter.post('/logout',authenticateToken,(req:customRequest,res:Response,next:NextFunction)=>{
  if (req.token){
    //get the users token from request token
    const token:String = req.token;
    //add the token to the invalidated tokens array
    invalidatedTokens.push(token);
    res.status(200);
  }else{
    res.status(400);
  };
});

// • GET	/api/v1/vaults/:vaultID		get the most recent version of the users vault data using token payload
vaultsRouter.get('/:vaultID',authenticateToken,async (req:customRequest,res:Response,next:NextFunction)=>{
  //get the current user's vault from mongodb
  const vault: vaultDoc | null = await getVaultByUserEmail(req.payload.vault.email);
  if (vault){
    res.status(200).json({vault: vault});
  }else{
    res.status(400).json({message: 'There was an issue retrieving user data.'});
  };
});

vaultsRouter.use('/:vaultID/passwords',passwordRouter);