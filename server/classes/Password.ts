import { Vault } from "./Vault";

export class Password{
  vault: Vault;
  password: string;
  nickName: string;
  siteUrl: string;

  constructor(
    vault:Vault,
    hashedPassword: string,
    nickName: string,
    siteUrl: string,
  ){
    this.vault=vault;
    this.password = hashedPassword;
    this.nickName =nickName;
    this.siteUrl = siteUrl;
  };
}