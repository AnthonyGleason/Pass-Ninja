import express from 'express';
import { Response,NextFunction } from 'express';
import { CustomRequest } from '../../interfaces/interfaces';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { passwordRouter } from './password';
export const vaultRouter = express.Router();
//use password entry route
vaultRouter.use('/passwords',passwordRouter);
//create a new vault for user
vaultRouter.post('/new',(req:CustomRequest, res: Response, next:NextFunction)=>{

});
//get a vault for the signed in user
vaultRouter.get('/:vaultID',(req:CustomRequest, res: Response, next:NextFunction)=>{

});
//update vault master password
vaultRouter.put('/:vaultID',(req:CustomRequest, res: Response, next:NextFunction)=>{
  
});