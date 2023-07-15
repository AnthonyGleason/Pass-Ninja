//import type definitions
import { NextFunction, Response } from "express";
import { customRequest } from '../../interfaces/interfaces';
//create router
import express from 'express';
export const apiRouter = express.Router();

//greeting
apiRouter.get('/',(req: customRequest,res: Response,next:NextFunction)=>{
  res.status(200).json({'messasge':'Welcome to the PassNinja api!'});
});

// • POST	/api/v1/users/	create an account and vault for the user 
// • GET 	/api/v1/users/verify	verify the token has provided
// • POST	/api/v1/users/login	sign into already existing account 
// • POST	/api/v1/users/logout	log out of account invalidating the users token
// • GET	/api/v1/users/:userID/vaults/:vaultID		get users vault data with hashed passwords
// • POST	/api/v1/users/:userID/vaults/:vaultID/passwords/	create a new password in a vault
// • PUT	/api/v1/users/:userID/vaults/:vaultID/passwords/:passwordID	update a password entry in the vault