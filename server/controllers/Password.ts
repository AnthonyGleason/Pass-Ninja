import { Password } from "../classes/Password";
import { Vault } from "../classes/Vault";
import { PasswordModel } from "../models/Password";

// createPassword
export async function createPassword (
  vault: string,
  password: string,
  nickName: string,
  siteUrl: string
){
  return await PasswordModel.create({
    vault: vault,
    password: password,
    nickName: nickName,
    siteUrl: siteUrl
  })
};

// getAllPasswordsByVaultID
export async function getAllPasswordsByVaultID(vaultID: string){
  return await PasswordModel.find({vault: vaultID}).populate('vault');
};

// getPasswordByID
export async function getPasswordByID(passwordID:string){
  return await PasswordModel.findById(passwordID).populate('vault');
};

// updatePasswordByID
export async function updatePasswordByID(passwordID:string,updatedPassword:Password){
  return await PasswordModel.findByIdAndUpdate(passwordID,updatedPassword).populate('vault');
};

// deletePasswordByID
export async function deletePasswordByID(passwordID:string){
  return await PasswordModel.findByIdAndDelete(passwordID).populate('vault');
};

// deleteAllPasswordsByVaultID
export async function deletePasswordsByVaultID(vaultID: string){
  return await PasswordModel.deleteMany({vault: vaultID});
};