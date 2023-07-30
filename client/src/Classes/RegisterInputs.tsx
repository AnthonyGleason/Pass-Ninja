export class RegisterInputs{
  firstName: string;
  lastName: string;
  email: string;
  masterPassword: string;
  masterPasswordConfirm: string;

  constructor(
    firstName?: string,
    lastName?: string,
    email?: string,
    masterPassword?: string,
    masterPasswordConfirm?:string,
  ){
    this.firstName = firstName || '';
    this.lastName = lastName || '';
    this.email = email || '';
    this.masterPassword = masterPassword || '';
    this.masterPasswordConfirm = masterPasswordConfirm || '';
  };

  //register a new user with inputs
  register = async():Promise<string>=>{
    const response = await fetch('http://localhost:5000/v1/api/vaults/register',{
      method: 'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        masterPassword: this.masterPassword,
        masterPasswordConfirm: this.masterPasswordConfirm
      }),
    });
    const responseData = await response.json();
    return responseData.token;
  };
}