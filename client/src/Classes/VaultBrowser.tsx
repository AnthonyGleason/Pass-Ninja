import { LoginInputs } from "./LoginInputs";
import { RegisterInputs } from "./RegisterInputs";
import { VaultInputs } from "./VaultInputs";

export class VaultBrowser{
  passwords:any[];
  masterPassword:string;
  loginInputs:LoginInputs;
  vaultInputs:VaultInputs;
  registerInputs:RegisterInputs;

  constructor(
    passwords:any[],
    loginInputs?:LoginInputs,
    registerInputs?:RegisterInputs,
    vaultInputs?:VaultInputs,
  ){
    this.masterPassword='';
    this.passwords=passwords;
    this.loginInputs = loginInputs || new LoginInputs();
    this.registerInputs = registerInputs || new RegisterInputs();
    this.vaultInputs = vaultInputs || new VaultInputs();
  };

};