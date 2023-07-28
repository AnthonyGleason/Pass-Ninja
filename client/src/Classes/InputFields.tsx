export class InputFields{
  nickNameInput: string;
  siteUrlInput: string;
  emailInput: string;
  passwordInput: string;
  masterPasswordInput: string;
  
  constructor(
    masterPasswordInput?:string,
    nickNameInput?:string,
    siteUrlInput?:string,
    emailInput?:string,
    passwordInput?:string
  ){
    this.masterPasswordInput= masterPasswordInput || '';
    this.nickNameInput = nickNameInput || '';
    this.siteUrlInput = siteUrlInput || '';
    this.emailInput = emailInput || '';
    this.passwordInput = passwordInput || '';
  }
}