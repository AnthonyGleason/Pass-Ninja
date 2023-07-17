import { Document } from 'mongoose';
import { User } from '../classes/User';
import {UserModel} from '../models/User';

// createUser
export const createUser = async function(
  firstName: string,
  lastName: string,
  email: string,
){
  return await UserModel.create({
    firstName: firstName,
    lastName: lastName,
    email: email
  });
};

// getUserByID
export const getUserByID = async function(userID:string){
  return await UserModel.findById(userID);
};

// updateUserByID
export const updateUserByID = async function(userID:string,updatedUser: Document){
  return await UserModel.findByIdAndUpdate(userID,updatedUser);
};

// deleteUserByID
export const deleteUserByID = async function(userID: string){
  return await UserModel.findByIdAndDelete(userID);
};