import express from 'express';
import {Response,NextFunction} from 'express';
import { CustomRequest } from '../../interfaces/interfaces';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
export const passwordRouter = express.Router();
//create a new password entry
passwordRouter.post('/',(req:CustomRequest, res: Response, next:NextFunction)=>{
  
})
//get all passwords for logged in user
passwordRouter.get('/',(req:CustomRequest, res: Response, next:NextFunction)=>{

});
//update an existing password entry
passwordRouter.put('/:passwordEntry',(req:CustomRequest, res: Response, next:NextFunction)=>{

})
//delete a password entry
passwordRouter.delete('/:passwordEntry',(req:CustomRequest, res: Response, next:NextFunction)=>{

})
//generate a secure password the user can use server side within user constraints
passwordRouter.get('/generate',(req:CustomRequest, res: Response, next:NextFunction)=>{
  
})