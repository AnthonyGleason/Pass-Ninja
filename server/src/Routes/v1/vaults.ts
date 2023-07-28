//    /v1/api/vaults/
//import type definitions
import { NextFunction, Response } from "express";
import { customRequest, vaultDoc} from '../../Interfaces/interfaces';
import express from "express";
import { passwordRouter } from "./passwords";
import { invalidatedTokens, registerNewUser } from "../../Helpers/auth";
import { createExamplePassword } from "../../Helpers/vault";
import { authenticateToken } from "../../Middlewares/Auth";
import { getVaultByUserEmail } from "../../Controllers/vault";
import { loginExistingUser } from "../../Helpers/auth";

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

vaultsRouter.use('/passwords',passwordRouter);