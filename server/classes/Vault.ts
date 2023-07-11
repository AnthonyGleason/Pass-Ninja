import { ObjectId } from "mongoose";

export class Vault{
  user: ObjectId;
  masterPassword: string;
  timestamp: ObjectId;
  
  constructor(
    user: ObjectId,
    masterPassword: string,
    timestamp: ObjectId,
    ){
    this.user = user;
    this.masterPassword = masterPassword;
    this.timestamp = timestamp;
  };
}