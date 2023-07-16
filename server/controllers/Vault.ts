import { Types } from "mongoose";
import { Vault } from "../classes/Vault";
import VaultModel from '../models/Vault';

// createVault
export const createVault = async function(
  masterPassword: string,
  userID: string,
  nickName: string,
):Promise<Vault>{
  await VaultModel.create({
    userID:userID,
    masterPassword: masterPassword,
    nickName: nickName,
  });
  const vault:Vault = new Vault(masterPassword,userID,nickName);
  return vault;
};
// getVaultByUserID
export const getVaultByUserID = function(){

};
// getVaultByID
export const getVaultByID = function(){

};
// updateVaultByUserID
export const updateVaultByUserID = function(){

};
// deleteVaultByUserID
export const deleteVaultByUserID = function(){

};