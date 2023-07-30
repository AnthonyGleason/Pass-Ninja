export class LoginInputs{
  email:string;
  masterPassword:string;

  constructor(
    email?:string,
    masterPassword?:string,
  ){
    this.email = email || '';
    this.masterPassword = masterPassword || '';
  };

  //login a user to their vault
  login = async ():Promise<string>=>{
    const response = await fetch('http://localhost:5000/v1/api/vaults/login',{
      method: 'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: this.email,
        masterPassword: this.masterPassword
      }),
    });
    const responseData = await response.json();
    const token:string = responseData.token;
    return token;
  };
}