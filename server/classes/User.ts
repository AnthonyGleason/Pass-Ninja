import {ObjectId} from 'mongoose';

export class User{
  firstName:string;
  lastName:string;
  email:string;
  timestamp:ObjectId;
  
  constructor(
    firstName: string,
    lastName:string,
    email:string,
    timestamp:ObjectId,
  ){
    this.firstName=firstName;
    this.lastName=lastName;
    this.email=email;
    this.timestamp=timestamp;
  }
}