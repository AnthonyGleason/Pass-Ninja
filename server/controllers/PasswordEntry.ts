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
}
//update a password entry
export const updatePasswordEntry = async function(
  docID:Types.ObjectId,
  updatedPasswordEntry: PasswordEntry
  ){
  return await PasswordEntryModel.findByIdAndUpdate(docID,updatedPasswordEntry);
}
//get a password entry by docID
//get all password entries
//get a password entry by nickname (search);
//delete a password entry by docID