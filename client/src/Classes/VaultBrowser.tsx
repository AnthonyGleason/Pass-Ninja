import { Login} from "./Login";
import { Register} from "./Register";
import { Vault } from "./Vault";

export class VaultBrowser{
  login:Login;
  vault:Vault;
  register:Register;

  constructor(
    login?:Login,
    register?:Register,
    vault?:Vault,
  ){
    this.login = login || new Login();
    this.register = register || new Register();
    this.vault = vault || new Vault();
  };
};