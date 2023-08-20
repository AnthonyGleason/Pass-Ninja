import { Document, Types } from 'mongoose';
import { Request } from 'express';

export interface customRequest extends Request{
  payload?: any,
  token?: String, //token's type is capitalized because bcrypt strictly enforces 'String' instead of 'string'
};

export interface vaultDoc extends Document{
  hashedMasterPassword: string,
  firstName: string,
  lastName: string,
  email: string,
  twoFactorAuthSecret: string,
};

export interface passwordDoc extends Document{
  vaultID: any,
  userName: string,
  encryptedPassword:string;
  encryptedNotes:string;
  nickName:string;
  siteUrl: string;
  expiresOn: Date;
}