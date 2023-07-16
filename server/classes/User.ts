import { createVault } from "../controllers/Vault";
import { Password } from "./Password";
import { Vault } from "./Vault";

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

  populateUserData = ()=>{
    //get vault data from mongodb based on the provided email

    //populate the vault data with the users vault

    //populate the userID with the correct userID
  };
}