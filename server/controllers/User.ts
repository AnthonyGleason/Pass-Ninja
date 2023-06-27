import { UserModel } from "../models/User";
import { Types } from 'mongoose';
import { User } from "../interfaces/interfaces";
//create a new user
export const createUser = async function(
  firstName: String,
  lastName: String,
  email: String,
  timestamp: Types.ObjectId
){
  return await UserModel.create({
    firstName: firstName,
    lastName: lastName,
    email: email,
    timestamp: timestamp,
  });
};
//get a user by docID
export const getUserByDocID = async function(docID: Types.ObjectId){
  return await UserModel.findById(docID);
};
//get all users
export const getAllUsers = async function(){
  return await UserModel.find({});
};
//update user by docID
export const updateUserByUserID = async function(docID: Types.ObjectId, updatedUser:User){
  return await UserModel.findByIdAndUpdate(docID,updatedUser);
};
//delete a user by docID
export const deleteUserByDocID = async function(docID: Types.ObjectId){
  return await UserModel.findByIdAndDelete(docID);
};