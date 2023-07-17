/*
  Both the Vault class and User class depend on each other. Originally I was going to keep everything in the User class but wanted to
  split both for easier to read code.
*/
import { Document } from "mongoose";
import { Vault } from "../classes/Vault";
import { VaultModel } from '../models/Vault';

//create a new vault for a user
// createVault
export const createVault = async function(
  masterPassword: string,
  user: string,
  nickName: string,
){
  return await VaultModel.create({
    user:user,
    masterPassword: masterPassword,
    nickName: nickName,
  });
};

export const getVaultByUserID = async function(userID: string){
  return await VaultModel.findOne({ user: userID }).populate('User');
};

// get vault by vault id
export const getVaultByID = async function(vaultID:string){
  return await VaultModel.findById(vaultID).populate('User');
};

// update vault by inputted user id
export const updateVaultByUserID = async function(userID:string,updatedVault:Document){
  return await VaultModel.findOneAndUpdate({user: userID},updatedVault).populate('User');
};

// deletes a vault for the user id inputted
export const deleteVaultByUserID = async function(userID:string){
  return await VaultModel.findOneAndDelete({user: userID});
};