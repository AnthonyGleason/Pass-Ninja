import { encryptPassword } from "../Helpers/Passwords";

export class Vault{
  nickNameInput:string;
  siteUrlInput:string;
  userNameInput:string;
  passwordInput:string;
  masterPassword:string;
  passwords:any[];

  constructor(
    passwords?:any[],
    nickNameInput?:string,
    siteUrlInput?:string,
    userNameInput?:string,
    passwordInput?:string,
    masterPassword?:string
  ){
    this.nickNameInput = nickNameInput || '';
    this.siteUrlInput = siteUrlInput || '';
    this.userNameInput = userNameInput || '';
    this.passwordInput = passwordInput || '';
    this.passwords = passwords || [];
    this.masterPassword = masterPassword || '';
  };

  createNewPassword = async()=>{
    const response = await fetch('http://localhost:5000/v1/api/vaults/passwords',{
      method: 'POST',
      headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
      },
      body: JSON.stringify({
        nickName: this.nickNameInput,
        siteUrl:  this.siteUrlInput,
        userName: this.userNameInput,
        encryptedPassword: encryptPassword(this.passwordInput,this.masterPassword),
      }),
    });
    await response.json();
  };
};