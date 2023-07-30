export class Register{
  firstNameInput: string;
  lastNameInput: string;
  emailInput: string;
  masterPasswordInput: string;
  masterPasswordConfirmInput: string;

  constructor(
    firstNameInput?: string,
    lastNameInput?: string,
    emailInput?: string,
    masterPasswordInput?: string,
    masterPasswordConfirmInput?:string,
  ){
    this.firstNameInput = firstNameInput || '';
    this.lastNameInput = lastNameInput || '';
    this.emailInput = emailInput || '';
    this.masterPasswordInput = masterPasswordInput || '';
    this.masterPasswordConfirmInput = masterPasswordConfirmInput || '';
  };

  //register a new user with inputs
  register = async():Promise<string>=>{
    const response = await fetch('http://localhost:5000/v1/api/vaults/register',{
      method: 'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName: this.firstNameInput,
        lastName: this.lastNameInput,
        email: this.emailInput,
        masterPassword: this.masterPasswordInput,
        masterPasswordConfirm: this.masterPasswordConfirmInput
      }),
    });
    const responseData = await response.json();
    return responseData.token;
  };
}