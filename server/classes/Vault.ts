import { Password } from "./Password";

export class Vault{
  masterPassword:string;
  user:string;
  passwords:[Password] | undefined;
  nickName: string | undefined;
  
  constructor(
    masterPassword: string,
    user: string,
    nickName: string,
    passwords?: [Password],
  ){
    this.masterPassword = masterPassword;
    this.user = user;
    this.nickName = nickName || undefined;
    this.passwords = passwords || undefined;
  }

  populatePasswords = () =>{
    //get password data from mongodb
  };
};