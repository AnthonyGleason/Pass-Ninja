import { decryptPassword, encryptPassword } from "../Helpers/Passwords";

export class VaultController{
  masterPassword:string;
  passwords:any[];
  isTwoFactorEnabled:boolean;
  constructor(
    passwords?:any[],
    masterPassword?:string,
    isTwoFactorEnabled?:boolean,
  ){
    this.passwords = passwords || [];
    this.masterPassword = masterPassword || '';
    this.isTwoFactorEnabled = isTwoFactorEnabled || false; //only used in the 2fa vault settings to enable or disable 2fa. (server will additionally verify this before applying changes);
  };

  createNewPassword = async(
    passwordInput: string,
    nickNameInput: string,
    siteUrlInput: string,
    userNameInput: string,
    notesInput:string
  )=>{
    const response = await fetch('http://localhost:5000/v1/api/vaults/passwords',{
      method: 'POST',
      headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
      },
      body: JSON.stringify({
        nickName: nickNameInput,
        siteUrl:  siteUrlInput,
        userName: userNameInput,
        encryptedPassword: encryptPassword(passwordInput,this.masterPassword),
        encryptedNotes: encryptPassword(notesInput,this.masterPassword),
      }),
    });
    await response.json();
  };

  updatePassword = async(
    passwordID:string,
    passwordInput: string,
    nickNameInput: string,
    siteUrlInput: string,
    userNameInput: string,
    notesInput:string
  ) =>{
    //update the password
    await fetch(`http://localhost:5000/v1/api/vaults/passwords/${passwordID}`,{
      method: 'PUT',
      headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
      },
      body: JSON.stringify({
        nickName: nickNameInput,
        siteUrl:  siteUrlInput,
        userName: userNameInput,
        encryptedPassword: encryptPassword(passwordInput,this.masterPassword),
        encryptedNotes: encryptPassword(notesInput,this.masterPassword),
      }),
    });
    //retrieve the new password data again from the server
    await this.populatePasswords();
  };

  populatePasswords = async()=>{
    await fetch(`http://localhost:5000/v1/api/vaults/passwords/`,{
      method: 'GET',
      headers:{
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
      }
    })
    .then(async (responseData:any)=>{
      //decrypt passwords
      const data = await responseData.json();
      //make a copy of the passwords array sent by the server
      let passwords: any[] = data.passwords;
      //decrypt the user's passwords and notes
      passwords.forEach((password:any)=>{
        //checking for the encryptedPassword property  and encryptedNotes proprties to prevent malformed utf-8 errors
        if (password.encryptedPassword) password.decryptedPassword=decryptPassword(password.encryptedPassword,this.masterPassword);
        if (password.encryptedNotes) password.decryptedNotes = decryptPassword(password.encryptedNotes,this.masterPassword);
      });
      //populate the passwords property with the decryptedPasswords
      this.passwords = passwords;
    });
    return this.passwords;
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

  logOutUser = async()=>{
    await fetch(`http://localhost:5000/v1/api/vaults/logout`,{
      method: 'POST',
      headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
      }
    });
  };
};