import { User } from "./User";

export class Vault{
  user:User;
  masterPassword:string;

  constructor(
    user: User,
    masterPassword: string,
  ){
    this.user=user;
    this.masterPassword = masterPassword
  }
}