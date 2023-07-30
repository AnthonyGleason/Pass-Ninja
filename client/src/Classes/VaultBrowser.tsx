import { InputFields } from "./InputFields";

export class VaultBrowser{
  passwords:any[];
  masterPassword:string;
  inputFields:InputFields;

  constructor(
    passwords:any[],
    inputFields?:InputFields,
  ){
    this.masterPassword='';
    this.passwords=passwords;
    this.inputFields = inputFields || new InputFields();
  };
  //login a user to their vault
  login = async ():Promise<string>=>{
    const response = await fetch('http://localhost:5000/v1/api/vaults/login',{
      method: 'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: this.inputFields.email,
        masterPassword: this.inputFields.masterPassword
      }),
    });
    const responseData = await response.json();
    const token:string = responseData.token;
    return token;
  };
  //move register here
  register = async():Promise<string>=>{
    const response = await fetch('http://localhost:5000/v1/api/vaults/register',{
      method: 'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName: this.inputFields.firstName,
        lastName: this.inputFields.lastName,
        email: this.inputFields.email,
        masterPassword: this.inputFields.masterPassword,
        masterPasswordConfirm: this.inputFields.masterPasswordConfirm
      }),
    });
    const responseData = await response.json();
    return responseData.token;
  };
};