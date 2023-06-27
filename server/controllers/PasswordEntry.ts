import {Types} from 'mongoose';
const passwordEntryModel = require('../models/PasswordEntry');
//create a new password entry
const createPasswordEntry = async function(
  siteURL: String,
  password:String,
  vault: Types.ObjectId,
  timestamp: Types.ObjectId,
  nickname?:String,){
  return await passwordEntryModel.create({
    siteURL: siteURL,
    password: password,
    nickname: nickname,
    vault: vault,
    timestamp: timestamp,
  })
}
//update a password entry
//get a password entry by docID
//get all password entries
//get a password entry by nickname (search);
//delete a password entry by docID