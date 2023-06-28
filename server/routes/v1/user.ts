import express from 'express';
import {Response,NextFunction} from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { CustomRequest } from '../../interfaces/interfaces';
import { authenticateToken } from '../../auth';
export const userRouter = express.Router();
//validate token
userRouter.get('/verify',authenticateToken,(req:CustomRequest, res: Response, next:NextFunction)=>{
  res.status(200).json({'isValid': true});
});
//login
userRouter.post('/login',(req:CustomRequest,res:Response,next:NextFunction)=>{
  //get user for email provided in req
  //compared hashed master password in the users vault to plaintext password provided by user
});
//logout
userRouter.post('/logout',authenticateToken,(req:CustomRequest, res: Response, next:NextFunction)=>{
  //invalidate authentication token
});
//register
userRouter.post('/register',(req:CustomRequest, res: Response, next:NextFunction)=>{
  //create a new vault for the signed in user storing hashed password
});
//subscribe
userRouter.put('/subscribe',authenticateToken,(req:CustomRequest, res: Response, next:NextFunction)=>{
  //subscribe by updating the subscription status for the currently signed in user
  //update the timestamp
});
//unsubscribe
userRouter.put('/unsubscribe',authenticateToken,(req:CustomRequest, res: Response, next:NextFunction)=>{
  //unsubscribe by update the subscription status for the currently signed in user
  //update the timestamp
});
//get current user account info
userRouter.get('/info',authenticateToken,(req:CustomRequest, res: Response, next:NextFunction)=>{
  //return the current user's user document
});
//update user account info
userRouter.put('/info',authenticateToken,(req:CustomRequest, res: Response, next:NextFunction)=>{
  //update the email, name and lastname associated with the user account
  //update the timestamp
});