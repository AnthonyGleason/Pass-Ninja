import express from 'express';
import { Response,NextFunction } from 'express';
import { CustomRequest } from '../../interfaces/interfaces';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { passwordRouter } from './password';
import { authenticateToken } from '../../auth';
export const vaultRouter = express.Router();
//use password entry route
vaultRouter.use('/passwords',passwordRouter);

//create a new vault for user
vaultRouter.post('/new',authenticateToken,(req:CustomRequest, res: Response, next:NextFunction)=>{
  //create a new vault for the user using the provided master password
  //store the hashed password in the vault
  //update the timestamp
});
//get a vault for the signed in user
vaultRouter.get('/:vaultID',authenticateToken,(req:CustomRequest, res: Response, next:NextFunction)=>{
  //get vault based on userID from payload
  //return the vault document
});
//update vault master password
vaultRouter.put('/:vaultID',authenticateToken,(req:CustomRequest, res: Response, next:NextFunction)=>{
  /*
    i recommend users backup their vault before performing this step because it can result in data loss.
    this also may take a while because it goes through all of the users passwords updating the stored password hash for each
  */

  //get vault for user
  //hash the new password update the vault master password, hashing it with the new password
  //hash each of the users password entries with the new password
});