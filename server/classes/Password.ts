import { Vault } from "./Vault";

export class Password{
  password: string;
  nickName: string;
  siteUrl: string;

  constructor(
    hashedPassword: string,
    nickName: string,
    siteUrl: string,
  ){
    this.password = hashedPassword;
    this.nickName =nickName;
    this.siteUrl = siteUrl;
  };
}