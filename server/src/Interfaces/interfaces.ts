import { Document, Types } from 'mongoose';
import { Request } from 'express';

export interface customRequest extends Request{
  /*
    payload was previously set to jwt.JwtPayload but i kept getting type errors in the subscription route
    in user.ts. 
  */
  payload?: any,
  token?: String,
};

export interface vault extends Document{
  hashedMasterPassword: string,
  firstName: string,
  lastName: string,
  email: string,
};