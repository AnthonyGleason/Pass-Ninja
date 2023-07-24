import { VaultModel } from "../Models/Vault";
import { vaultDoc } from "../Interfaces/interfaces";

//create a vault
export const createVault = async function(
  firstName:string,
  lastName:string,
  email:string,
  hashedMasterPassword:string
){
  return await VaultModel.create({
    firstName: firstName,
    lastName: lastName,
    email: email,
    hashedMasterPassword: hashedMasterPassword,
  });
};

//get a vault by id
export const getVaultByID = async function(vaultID:string):Promise<vaultDoc | null>{
  return await VaultModel.findById(vaultID);
};

//get a vault by user email
export const getVaultByUserEmail = async function(email:string):Promise<vaultDoc | null>{
  return await VaultModel.findOne({email: email});
};

//update a vault by id
export const updateVaultByID = async function(vaultID:string,updatedVaultDoc:vaultDoc):Promise<vaultDoc| null>{
  return await VaultModel.findByIdAndUpdate(vaultID,updatedVaultDoc);
};

//delete a vault by id
export const deleteVaultByID = async function(vaultID:string):Promise<vaultDoc | null>{
  return await VaultModel.findByIdAndDelete(vaultID);
};