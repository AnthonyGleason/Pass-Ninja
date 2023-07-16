import { Password } from "./Password";

export class Vault{
  masterPassword:string;
  userID:string;
  passwords:[Password] | undefined;
  nickName: string | undefined;
  
  constructor(
    masterPassword: string,
    userID: string,
    nickName: string,
    passwords?: [Password],
  ){
    this.masterPassword = masterPassword;
    this.userID = userID;
    this.nickName = nickName || undefined;
    this.passwords = passwords || undefined;
  }

  populatePasswords = () =>{
    //get password data from mongodb
  };
};