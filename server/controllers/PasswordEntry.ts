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
export const updatePasswordEntryByDocID = async function(
  docID:Types.ObjectId,
  updatedPasswordEntry: PasswordEntry
  ){
  return await PasswordEntryModel.findByIdAndUpdate(docID,updatedPasswordEntry);
};
//get a password entry by docID
export const getPasswordEntryByDocID = async function(docID:Types.ObjectId){
  return await PasswordEntryModel.findById(docID);
};
//get all password entries for a vault ID
export const getAllPasswordEntriesByVaultID = async function(docID:Types.ObjectId){
  return await PasswordEntryModel.find({'vault': docID});
};
//delete a password entry by docID
export const removePasswordEntryByDocID = async function(docID: Types.ObjectId){
  return await PasswordEntryModel.findByIdAndDelete(docID);
};