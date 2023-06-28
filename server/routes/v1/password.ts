import express from 'express';
import {Response,NextFunction} from 'express';
import { CustomRequest } from '../../interfaces/interfaces';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authenticateToken } from '../../auth';
export const passwordRouter = express.Router();
//create a new password entry for logged in user
passwordRouter.post('/',authenticateToken,(req:CustomRequest, res: Response, next:NextFunction)=>{
  
})
//get all passwords for logged in user
passwordRouter.get('/',authenticateToken,(req:CustomRequest, res: Response, next:NextFunction)=>{

});
//update an existing password entry
passwordRouter.put('/:passwordEntry',authenticateToken,(req:CustomRequest, res: Response, next:NextFunction)=>{

})
//delete a password entry
passwordRouter.delete('/:passwordEntry',authenticateToken,(req:CustomRequest, res: Response, next:NextFunction)=>{

})
/* 
  generate a secure password the user can use server side within user constraints
  for example, minLength = 10 maxLength = 30, specialChar=True (etc...);
*/
passwordRouter.get('/generate',authenticateToken,(req:CustomRequest, res: Response, next:NextFunction)=>{

})