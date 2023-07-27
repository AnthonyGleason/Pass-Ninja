export class VaultBrowser{
  passwords:any[];
  nickNameInput: string;
  siteUrlInput: string;
  emailInput: string;
  passwordInput: string;
  masterPasswordInput: string;
  masterPassword:string;
  constructor(
    passwords:any[],
  ){
    this.masterPassword='';
    this.masterPasswordInput='';
    this.passwords=passwords;
    this.nickNameInput ='';
    this.siteUrlInput = '';
    this.emailInput = '';
    this.passwordInput = '';
  };
}