import express from 'express';
import {Response,NextFunction} from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { CustomRequest } from '../../interfaces/interfaces';
export const userRouter = express.Router();

//authenticates jwt tokens
const authenticateToken = function(req:CustomRequest, res:Response, next:NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  };
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as jwt.Secret, (err, payload) => {
    if (err) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    req.payload = payload;
    next();
  });
};
//validate token
userRouter.get('/verify',(req:CustomRequest, res: Response, next:NextFunction)=>{

});
//login
userRouter.post('/login',(req:CustomRequest,res:Response,next:NextFunction)=>{

});
//logout
userRouter.post('/logout',(req:CustomRequest, res: Response, next:NextFunction)=>{

});
//register
userRouter.post('/register',(req:CustomRequest, res: Response, next:NextFunction)=>{

});
//subscribe
userRouter.post('/subscribe',(req:CustomRequest, res: Response, next:NextFunction)=>{

});
//unsubscribe
userRouter.post('/unsubscribe',(req:CustomRequest, res: Response, next:NextFunction)=>{

});
//get current user account settings
userRouter.get('/settings',(req:CustomRequest, res: Response, next:NextFunction)=>{

});
//update user account settings
userRouter.put('/settings',(req:CustomRequest, res: Response, next:NextFunction)=>{

});