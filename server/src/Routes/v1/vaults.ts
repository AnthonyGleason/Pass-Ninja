import express from "express";
import bcrypt from 'bcrypt';

import { NextFunction, Response } from "express";
import { customRequest, passwordDoc, vaultDoc } from '../../Interfaces/interfaces';

import { invalidatedTokens, generateHashedPassword, loginExistingUser, registerNewUser, twoFactorPendingTokens } from "../../Helpers/auth";
import { createExamplePassword, generatePassword } from "../../Helpers/vault";

import { authenticateToken } from "../../Middlewares/Auth";

import { getVaultByUserEmail, updateVaultByID } from "../../Controllers/vault";
import { updatePasswordByID } from "../../Controllers/password";
import { passwordRouter } from "./passwords";
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

export const vaultsRouter = express.Router();

// • GET 	/v1/api/vaults/verify	verify the token provided
vaultsRouter.get('/verify', authenticateToken, (req:customRequest,res:Response,next:NextFunction)=>{
  res.status(200).json({
    isValid: true,
    message: 'The provided token has been successfully validated.',
  });
});

// • POST /v1/api/vaults/register create a new vault
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

// • POST	/v1/api/vaults/login	use the demo user
vaultsRouter.get('/demologin', async (req:customRequest,res:Response,next:NextFunction)=>{
  const email:string = `demo@user${generatePassword(12,12,false,true,true)}`;
  const vault= await registerNewUser('demopass','demopass','Demo','User',email);
  //create a new example password in the users vault
  if (vault) await createExamplePassword(vault._id,'demopass');
  const token:string = await loginExistingUser(email,'demopass');
  if (token){
    res.status(200).json({'token': token});
  }else{
    res.status(401);
  }
});

// • POST	/v1/api/vaults/login	sign into already existing account 
vaultsRouter.post('/login', async (req:customRequest,res:Response,next:NextFunction)=>{
  //destructure the request body
  const {
    email,
    masterPassword
  }:{
    email:string,
    masterPassword:string
  } = req.body;
  if (!email||!masterPassword){
    res.status(401);
  }else{
    const token:string = await loginExistingUser(email,masterPassword);
    if (token){
      res.status(200).json({'token': token});
    }else{
      res.status(400);
    };
  };
});

// • POST	/v1/api/vaults/logout	log out of account invalidating the users token
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

// PUT /v1/api/vaults/settings update the users vault settings
vaultsRouter.put('/settings',authenticateToken, async(req:customRequest,res:Response,next:NextFunction)=>{
  //if the input is not provided we can assume the user is not changing that setting
  const updatedMasterPassword:string = req.body.updatedMasterPassword || '';
  const updatedMasterPasswordConfirm:string = req.body.updatedMasterPasswordConfirm || '';
  const currentMasterPassword:string = req.body.currentMasterPassword || '';
  const updatedEmail:string = req.body.updatedEmail || '';
  //updated passwords is only provided if the user is updating their master password
  const updatedPasswords:[passwordDoc] = req.body.updatedPasswords || [];
  //ensure the user has entered their correct master password before updating any settings
  if (await bcrypt.compare(currentMasterPassword,req.payload.vault.hashedMasterPassword)){
    if (updatedEmail) req.payload.vault.email = updatedEmail;
    //if both passwords are provided and match update the vault and new passwords array with new encrypted passwords
    if (updatedMasterPassword && updatedMasterPasswordConfirm && updatedMasterPassword===updatedMasterPasswordConfirm){
      //hash and set new hashed password
      req.payload.vault.hashedMasterPassword=await generateHashedPassword(updatedMasterPassword);
      //for each password update the password document by id with the new password data
      updatedPasswords.forEach(async (password:passwordDoc)=>{
        await updatePasswordByID(password._id,password);
      })
    };
    //if email was updated, update the document with the new email
    if (updatedEmail){
      req.payload.vault.email = updatedEmail;
    };
    
    //apply changes to vault
    await updateVaultByID(req.payload.vault._id,req.payload.vault);
    res.status(200).json({'vault': req.payload.vault});
  }else{
    res.status(401).json({'message': 'An error has occured when updating your vault data'});
  };
});

// POST  /v1/api/vaults/setup2FA
vaultsRouter.post('/setup2FA',authenticateToken,async(req:customRequest,res:Response,next:NextFunction)=>{
  //generate the temporary secret
  const speakeasySecret = speakeasy.generateSecret({'length': 45});
  if (speakeasySecret && speakeasySecret.otpauth_url){
    //store that secret in a temporary auth array with an object containing the userID and secret key
    twoFactorPendingTokens.push({
      'userID': req.payload.vault._id,
      'secret': speakeasySecret
    });
    //create qr code
    QRCode.toDataURL(speakeasySecret.otpauth_url, {errorCorrectionLevel: 'M'}, function (err, url) {
      if (url){
        //send the qr code url to the client
        res.status(200).json({'qrCodeUrl': url});
      }else{
        res.status(500);
      }
    });
  }else{
    res.status(400);
  };
});

// • GET	/v1/api/vaults/		get the most recent version of the users vault data using token payload
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