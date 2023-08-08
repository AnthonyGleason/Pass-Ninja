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