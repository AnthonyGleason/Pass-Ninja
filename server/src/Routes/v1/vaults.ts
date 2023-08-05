//    /api/v1/vaults/
//import type definitions
import { NextFunction, Response } from "express";
import { customRequest, passwordDoc, vaultDoc} from '../../Interfaces/interfaces';
import express from "express";
import { passwordRouter } from "./passwords";
import { invalidatedTokens, registerNewUser } from "../../Helpers/auth";
import { createExamplePassword } from "../../Helpers/vault";
import { authenticateToken } from "../../Middlewares/Auth";
import { getVaultByUserEmail } from "../../Controllers/vault";
import { loginExistingUser } from "../../Helpers/auth";
import bcrypt from 'bcrypt';
import { updatePasswordByID } from "../../Controllers/password";
import { generateHashedPassword } from "../../Helpers/auth";
import { updateVaultByID } from "../../Controllers/vault";

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
  //create the vault in mongodb
  const vault = await registerNewUser(masterPassword,masterPasswordConfirm,firstName,lastName,email);
  //create a new example password in the users vault
  if (vault) await createExamplePassword(vault._id,masterPassword);
  //generate a token so users can access their vault immediately
  const token:string = await loginExistingUser(email,masterPassword);
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
  const {
    email,
    masterPassword
  }:{
    email:string,
    masterPassword:string
  } = req.body;
  const token:string = await loginExistingUser(email,masterPassword);
  if (token){
    res.status(200).json({'token': token});
  }else{
    res.status(401);
  }
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
    res.status(400).json({message: 'There was an error processing your request, please try again later.'});
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

// PUT /api/v1/vaults/settings update the users vault settings
vaultsRouter.put('/settings',authenticateToken, async(req:customRequest,res:Response,next:NextFunction)=>{
  //if the input is not provided we can assume the user is not changing that setting
  const updatedMasterPassword:string = req.body.masterPassword || '';
  const updatedMasterPasswordConfirm:string = req.body.masterPasswordConfirm || '';
  const currentMasterPassword:string = req.body.currentMasterPassword || '';
  const updatedEmail:string = req.body.updatedEmail || '';
  //updated passwords is only provided if the user is updating their master password
  const updatedPasswords:[passwordDoc] = req.body.updatedPasswords || [];
  //ensure the user has entered their correct master password before updating any settings
  if (await bcrypt.compare(currentMasterPassword,req.payload.vault.hashedMasterPassword)){
    if (updatedEmail) req.payload.vault.email = updatedEmail;

    // //if both passwords are provided and match update the vault and new passwords array with new encrypted passwords
    // if (updatedMasterPassword && updatedMasterPasswordConfirm && updatedMasterPassword===updatedMasterPasswordConfirm){
    //   //hash and set new hashed password
    //   req.payload.vault.hashedMasterPassword=await generateHashedPassword(updatedMasterPassword);
    //   //for each password update the password document by id with the new password data
    //   updatedPasswords.forEach(async (password:passwordDoc)=>{
    //     await updatePasswordByID(password.id,password);
    //   })
    // };
    // //if email was updated, update the document with the new email
    // if (updatedEmail){
    //   req.payload.vault.email = updatedEmail;
    // };
    
    //apply changes to vault
    await updateVaultByID(req.payload.vault._id,req.payload.vault);
    res.status(200).json({'vault': req.payload.vault});
  }else{
    res.status(401).json({'message': 'An error has occured when updating your vault data'});
  }
});
vaultsRouter.use('/passwords',passwordRouter);