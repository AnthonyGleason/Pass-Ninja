import { decryptPassword, encryptPassword } from "../Helpers/Passwords";

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
  updatePassword = async(passwordID:string) =>{
    //update the password
    await fetch(`http://localhost:5000/v1/api/vaults/passwords/${passwordID}`,{
      method: 'PUT',
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
    //retrieve the new password data again from the server
    return await this.populatePasswords();
  };

  populatePasswords = async()=>{
    let fetchedPasswords:any[] = [];
    await fetch(`http://localhost:5000/v1/api/vaults/passwords/`,{
      method: 'GET',
      headers:{
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
      }
    })
    .then(async (responseData:any)=>{
      //decrypt passwords
      const data = await responseData.json();
      let passwords: any[] = data.passwords;
      passwords.forEach((password:any)=>{
        if (!password.encryptedPassword) return;
        password.decryptedPassword=decryptPassword(password.encryptedPassword,this.masterPassword);
      });
      fetchedPasswords = passwords;
    });
    this.passwords=fetchedPasswords;
    return fetchedPasswords;
  };

  deletePassword = async(passwordID:string)=>{
    await fetch(`http://localhost:5000/v1/api/vaults/passwords/${passwordID}`,{
      method: 'DELETE',
      headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
      }
    });
  };
};