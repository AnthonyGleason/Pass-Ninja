import { Types } from 'mongoose';
import { Request } from 'express';
import jwt from 'jsonwebtoken';

export interface PasswordEntry {
  siteURL: String;
  password: String;
  vault: Types.ObjectId;
  timestamp: Types.ObjectId;
  nickname?: String
};
export interface Subscription {
  vault: Types.ObjectId;
  isSubscribed: Boolean;
  renewalCycle: Number;
  timestamp: Types.ObjectId;
};
export interface Timestamp {
  dateModified: Date;
  dateCreated: Date;
  dateOfExpiration?: Date;
  dateOfSubscription?: Date;
};
export interface User {
  firstName: String;
  lastName: String;
  email: String;
  timestamp: Types.ObjectId;
};
export interface Vault {
  user: Types.ObjectId;
  masterPassword: String;
  timestamp: Types.ObjectId;
};
export interface CustomRequest extends Request{
  /*
    payload was previously set to jwt.JwtPayload but i kept getting type errors in the subscription route
    in user.ts. 
  */
  payload?: any,
  token?: String,
}