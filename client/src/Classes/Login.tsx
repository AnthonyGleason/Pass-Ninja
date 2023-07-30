export class Login{
  emailInput:string;
  masterPasswordInput:string;

  constructor(
    emailInput?:string,
    masterPasswordInput?:string,
  ){
    this.emailInput = emailInput || '';
    this.masterPasswordInput = masterPasswordInput || '';
  };

  //login a user to their vault
  login = async ():Promise<string>=>{
    const response = await fetch('http://localhost:5000/v1/api/vaults/login',{
      method: 'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: this.emailInput,
        masterPassword: this.masterPasswordInput
      }),
    });
    const responseData = await response.json();
    const token:string = responseData.token;
    return token;
  };
}