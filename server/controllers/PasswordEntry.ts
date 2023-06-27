import { Types } from 'mongoose';
import { PasswordEntry } from '../interfaces/interfaces';
import { PasswordEntryModel } from '../models/PasswordEntry';
//create a new password entry
export const createPasswordEntry = async function(
  siteURL: String,
  password:String,
  vault: Types.ObjectId,
  timestamp: Types.ObjectId,
  nickname?:String
  ){
  return await PasswordEntryModel.create({
    siteURL: siteURL,
    password: password,
    vault: vault,
    timestamp: timestamp,
    nickname: nickname
  });
};
//update a password entry
export const updatePasswordEntry = async function(
  docID:Types.ObjectId,
  updatedPasswordEntry: PasswordEntry
  ){
  return await PasswordEntryModel.findByIdAndUpdate(docID,updatedPasswordEntry);
};
//get a password entry by docID
export const getPasswordEntryByDocID = async function(docID:Types.ObjectId){
  return await PasswordEntryModel.findById(docID);
};
//get all password entries
export const getAllPasswordEntries = async function(){
  return await PasswordEntryModel.find({});
};
//delete a password entry by docID
export const removePasswordEntry = async function(docID: Types.ObjectId){
  return await PasswordEntryModel.findByIdAndDelete(docID);
};