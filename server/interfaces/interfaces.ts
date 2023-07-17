import { Document, Types } from 'mongoose';
import { Request } from 'express';
import { User } from '../classes/User';
import { Password } from '../classes/Password';

export interface customRequest extends Request{
  /*
    payload was previously set to jwt.JwtPayload but i kept getting type errors in the subscription route
    in user.ts. 
  */
  payload?: any,
  token?: String,
};

export interface vaultDoc extends Document {
  user: string;
  masterPassword: string;
  nickName: string;
}