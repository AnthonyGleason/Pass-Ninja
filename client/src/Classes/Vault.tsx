export class Vault{
  passwords:any[];
  nickNameInput: string;
  siteUrlInput: string;
  userNameInput: string;
  passwordInput: string;
  masterPassword:string;
  constructor(
    passwords:any[],
  ){
    this.masterPassword='';
    this.passwords=passwords;
    this.nickNameInput ='';
    this.siteUrlInput = '';
    this.userNameInput = '';
    this.passwordInput = '';
  };
}