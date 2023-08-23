import { VaultController } from "../Classes/VaultController";

export const verifyToken = async function(token:string){
  const response = await fetch('http://localhost:5000/v1/api/vaults/verify',{
    method: 'GET',
    headers:{
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('jwt')}`
    }
  });
  const data = await response.json();
  return data.isValid;
};
export const handleDemoLogin= async function(vaultController:VaultController,navigate:Function){
  const response = await fetch('http://localhost:5000/v1/api/vaults/demologin',{
    method: 'GET',
  });
  const responseData = await response.json();
  const token:string = responseData.token;
  if (token){
    //ensure master password is not set so user can not update the demo account
    vaultController.masterPassword = 'demopass';
    //set token in local storage
    localStorage.setItem('jwt',token);
    //redirect the user to the demo vault
    navigate('/vault');
  };
};

//handle the loading of protected routes
export const handleProtectedInitialPageLoad = async(
  vaultController:VaultController,
  setPasswordsArr:Function,
  setIsUserLoggedOut:Function,
)=>{
  //verify the users token and master password are present
  if (await verifyToken(localStorage.getItem('token') as string) && vaultController.masterPassword){
    await vaultController.populatePasswords()
    .then(()=>{
      setPasswordsArr(vaultController.passwords);
    });
  }else{
    //show user logged out popup
    setIsUserLoggedOut(true);
  }
};