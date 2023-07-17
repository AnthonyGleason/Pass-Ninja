import { Document } from "mongoose";
import { createVault, getVaultByUserID } from "../controllers/Vault";
import { Vault } from "./Vault";
import { vaultDoc } from "../interfaces/interfaces";

export class User{
  firstName: string;
  lastName: string;
  email: string;
  vault: Vault | undefined;
  userID: string | undefined;

  constructor(
    firstName: string,
    lastName: string,
    email: string,
    vault?: Vault,
    userID?: string,
  ){
    this.firstName = firstName;
    this.lastName = lastName;
    this.email= email;
    this.vault = vault || undefined;
    this.userID = userID || undefined;
  };

  createNewUser = async (
    hashedPassword:string,
    nickName:string
  ):Promise<void>=>{
    //a userID must exist to populate vault data
    if (!this.userID) return;
    //create a new vault
    this.vault = new Vault(hashedPassword,this.userID,nickName);
    await createVault(hashedPassword,this.userID,nickName);
  };

  populateUserData = async ():Promise<void>=>{
    //get vault data from mongodb based on userID
    if (!this.userID) return;
    const vaultDoc: vaultDoc | null = await getVaultByUserID(this.userID);
    //if vault does not exist exit
    if (!vaultDoc) return;
    //populate this classes userID with the correct userID
    this.userID = vaultDoc.user;
  };
}