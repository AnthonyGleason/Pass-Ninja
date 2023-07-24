//    /v1/api/vaults/
//import type definitions
import { NextFunction, Response } from "express";
import { customRequest, vaultDoc} from '../../Interfaces/interfaces';
import express from "express";
import { passwordRouter } from "./passwords";
import { invalidatedTokens, issueToken } from "../../Configs/auth";
import { authenticateToken } from "../../Middlewares/Auth";
import bcrypt, { genSalt } from 'bcrypt';
import { createVault, getVaultByUserEmail } from "../../Controllers/vault";
import { createPasswordEntry, getAllPasswordsByVaultID } from "../../Controllers/password";
import { Vault } from "../../Classes/Vault";

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
  //destructure the request body
  const {
    firstName,
    lastName,
    email,
    masterPassword,
    masterPasswordConfirm,
  }:{
    firstName:string,
    lastName:string,
    email:string,
    masterPassword:string,
    masterPasswordConfirm:string
  } = req.body;
  //create new vault class locally
  const vault:Vault = new Vault(masterPassword,email,firstName,lastName);
  //create the vault in mongodb and get a jwt token
  const token:string = await vault.createNewVault(masterPasswordConfirm);
  //create a new example password in the users vault
  await vault.createExamplePassword();
  //return the status based on if the token is available
  if (token){
    res.status(200).json({
      'token': token,
    });
  }else{
    res.status(400).json({'message': `There was an error creating an account with email ${email}`});
  };
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
    //if passwords match issue the client a token
    const token = issueToken(vault);
    const passwords = await getAllPasswordsByVaultID(vault._id);
    res.status(200).json({
      'token': token,
      'passwords': passwords
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
    res.status(200).json({message: 'You have been logged out.'});
  }else{
    res.status(400).json({message: 'There was an error with your request.'});
  };
});

// • GET	/api/v1/vaults/		get the most recent version of the users vault data using token payload
vaultsRouter.get('/',authenticateToken,async (req:customRequest,res:Response,next:NextFunction)=>{
  //get the current user's vault from mongodb
  const vault: vaultDoc | null = await getVaultByUserEmail(req.payload.vault.email);
  if (vault){
    res.status(200).json({vault: vault});
  }else{
    res.status(400).json({message: 'There was an issue retrieving user data.'});
  };
});

vaultsRouter.use('/passwords',passwordRouter);