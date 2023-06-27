import {Types} from 'mongoose';

export interface PasswordEntry {
  siteURL: string;
  password: string;
  vault: Types.ObjectId;
  timestamp: Types.ObjectId;
  nickname?: string;
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