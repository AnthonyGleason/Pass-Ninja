import {Types,Document} from 'mongoose';
export interface PasswordEntry extends Document {
  siteURL: string;
  password: string;
  vault: Types.ObjectId;
  timestamp: Types.ObjectId;
  nickname?: string;
}
//subscription
//timestamp
//user
//vault