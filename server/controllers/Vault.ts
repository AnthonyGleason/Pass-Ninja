import { VaultModel } from "../models/Vault";
import { Types } from "mongoose";
import { Vault } from "../interfaces/interfaces";
//create a vault for user
export const createVaultForUserID = async function(
  userDocID: Types.ObjectId,
  masterPassword: String,
  timestamp: Types.ObjectId
){
  return await VaultModel.create({
    user: userDocID,
    masterPassword: masterPassword,
    timestamp: timestamp,
  })
};
//update an existing vault
export const updateVaultByUserID = async function(docID: Types.ObjectId, updatedVault: Vault){
  return await VaultModel.findByIdAndUpdate(docID, updatedVault);
}
//get a vault by vault docID
export const getVaultByVaultID = async function(docID: Types.ObjectId){
  return await VaultModel.findById(docID);
}
//get a vault by user docID
export const getVaultByUserID = async function(docID: Types.ObjectId){
  return await VaultModel.findOne({'user': docID});
}
//delete a vault by user docID
export const deleteVaultByUserID = async function(docID: Types.ObjectId){
  return await VaultModel.findOneAndDelete({'user':docID});
}