import bcrypt, { genSalt } from "bcrypt";
import { createVault, getVaultByUserEmail } from "../Controllers/vault";
import { encryptPassword, generatePassword } from "../Helpers/auth";
import { issueToken } from "../Configs/auth";
import { createPasswordEntry } from "../Controllers/password";
import { vaultDoc } from "../Interfaces/interfaces";

export class Vault {
  masterPassword: string;
  email: string;
  firstName: string | undefined;
  lastName: string | undefined;
  id:string | undefined;

  constructor(
    masterPassword:string,
    email:string,
    firstName?:string,
    lastName?:string,
    id?:string
  ) {
    //handle optional arguments
    this.firstName = firstName || undefined;
    this.lastName = lastName || undefined;
    this.id = id || undefined;
    //set email for vault retrieval, set master pass for login and crud operations on vault
    this.masterPassword = masterPassword;
    this.email = email;

  };

  isEmailUnique = async():Promise<boolean> =>{
    const vault:vaultDoc | null = await getVaultByUserEmail(this.email);
    if (vault){
      return false;
    }else{
      return true;
    }
  };

  createNewVault = async(masterPasswordConfirm:string):Promise<string>=>{
    //passwords must match and the firstName and lastName properties must be set
    if (this.masterPassword===masterPasswordConfirm && this.firstName && this.lastName && await this.isEmailUnique()){
      //hash the masterPassword
      const salt = await genSalt(15);
      const hashedMasterPassword = await bcrypt.hash(this.masterPassword,salt);
      //create a new vault in mongodb for the user
      /*
        There is a compatibility issue between the returned mongoose document and the vaultDoc interface.
        Adding a vaultDoc type to the vault and a Promise<vaultDoc> return type on the createVault controller function 
        causes issues.
      */
      const vault = await createVault(this.firstName,this.lastName,this.email,hashedMasterPassword);
      this.id=vault._id.toString();
      //issue the client a token (so they do not need to login again)
      const token:string = issueToken(vault as vaultDoc);
      return token;
    }else{
      return '';
    }
  };

  /*
    Create the demo password entry for the new vault.
    The password is encrypted using the users 'plain text' master password provided in the request
    so the user can decrypt it clientside later.
  */
  createExamplePassword = async()=>{
    const tempUserName:string = 'demoUser123';
    const tempEncryptedPass:string = encryptPassword(generatePassword(35,50,true,true,true),this.masterPassword)
    const tempSiteUrl:string  = 'https://www.example.com';
    const tempNickName:string = 'Welcome to PassNinja'
    if (this.id) await createPasswordEntry(this.id,tempUserName,tempEncryptedPass,tempNickName,tempSiteUrl);
  };
};