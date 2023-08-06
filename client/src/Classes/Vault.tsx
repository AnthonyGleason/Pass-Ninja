import { decryptPassword, encryptPassword } from "../Helpers/Passwords";

export class Vault{
  masterPassword:string;
  passwords:any[];

  constructor(
    passwords?:any[],
    masterPassword?:string,
  ){
    this.passwords = passwords || [];
    this.masterPassword = masterPassword || '';
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
        if (!password.encryptedPassword) return null;
        password.decryptedPassword=decryptPassword(password.encryptedPassword,this.masterPassword);
      });
      //decrypt notes
      passwords.forEach((password:any)=>{
        if (!password.encryptedNotes) return null;
        password.decryptedNotes = decryptPassword(password.encryptedNotes,this.masterPassword);
      })
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