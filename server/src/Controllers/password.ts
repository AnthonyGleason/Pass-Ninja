import { Document } from "mongoose";
import { PasswordModel } from "../Models/Password";
import { passwordDoc } from "../Interfaces/interfaces";

//create a new password
export const createPasswordEntry = async function(
  vaultID:string,
  userName: string,
  encryptedPassword:string,
  nickName:string,
  siteUrl:string
){
  return await PasswordModel.create({
    vaultID: vaultID,
    userName: userName,
    encryptedPassword: encryptedPassword,
    nickName: nickName,
    siteUrl: siteUrl
  })
};

//get a password by ID
export const getPasswordByID = async function(passwordID:string):Promise<passwordDoc| null>{
  return await PasswordModel.findById(passwordID);
};

//get all passwords with vault ID
export const getAllPasswordsByVaultID = async function(vaultID:string):Promise<passwordDoc[]>{
  return await PasswordModel.find({vaultID: vaultID});
};

//update a password by ID
export const updatePasswordByID = async function(passwordID:string,updatedPasswordDoc:Document){
  return await PasswordModel.findByIdAndUpdate(passwordID,updatedPasswordDoc);
};

//delete a password by ID
export const deletePasswordByID = async function(passwordID:string){
  return await PasswordModel.findByIdAndDelete(passwordID);
}

//delete all passwords by vault ID
export const deleteAllPasswordsByVaulID = async function(vaultID:string){
  return await PasswordModel.deleteMany({vaultID: vaultID});
}