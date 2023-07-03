import express from 'express';
import { Response,NextFunction } from 'express';
import { CustomRequest } from '../../interfaces/interfaces';
import { passwordRouter } from './password';
import { authenticateToken, encryptPassword, generateHashedPassword } from '../../auth';
import { createVaultForUserID, getVaultByUserID, updateVaultByUserID } from '../../controllers/Vault';
import { createTimestamp } from '../../controllers/Timestamp';
import { getAllPasswordEntriesByVaultID,updatePasswordEntryByDocID} from '../../controllers/PasswordEntry';
export const vaultRouter = express.Router();
//use password entry route
vaultRouter.use('/passwords',passwordRouter);

//create a new vault for user
vaultRouter.post('/new',authenticateToken,async (req:CustomRequest, res: Response, next:NextFunction)=>{
  //destructure req body
  const {password, passwordConfirm }: {password:string,passwordConfirm:string} = req.body;
  let vault:Document;
  //get user id from auth
  const userID = req.payload.user._id;
  if (password===passwordConfirm){
    //create a new vault for the user using the provided master password
    vault = await createVaultForUserID(
      userID, 
      await generateHashedPassword(password), // generate a hashed password for the user
      await createTimestamp(new Date(),new Date())  //generate a new timestamp with the current date & time
    );
    res.status(200).json({'vault': vault});
  }else{
    res.status(400);
  }
});

//get a vault for the signed in user
vaultRouter.get('/:vaultID',authenticateToken,async(req:CustomRequest, res: Response, next:NextFunction)=>{
  const userID = req.payload.user._id;
  //get vault based on userID from payload
  res.json({'vault': await getVaultByUserID(userID)})
});

/*
  i recommend users backup their vault before performing this step because it can result in data loss.
  this also may take a while because it goes through all of the users passwords updating the stored password hash for each
*/

//update vault master password
vaultRouter.put('/:vaultID',authenticateToken,async(req:CustomRequest, res: Response, next:NextFunction)=>{
  //destructure request body
  const {password, passwordConfirm,masterPassword}:{password:string, passwordConfirm: string,masterPassword:string} = req.body;
  if (password===passwordConfirm){
    const userID = req.payload.user._id;
    //get vault for user
    const vault = await getVaultByUserID(userID);
    //update the master vault password locally
    vault.masterPassword = generateHashedPassword(password);
    //update the vault in mongodb
    await updateVaultByUserID(userID,vault);
    //update the password entries
    let passwordEntryArr: any[]= await getAllPasswordEntriesByVaultID(vault._id);
    //loop through each password in the users vault updating their passwords;
    for (let i=0;i<passwordEntryArr.length;i++){
      //update password entry with new hashed password locally
      passwordEntryArr[i].password = encryptPassword(password,masterPassword);
      //update the entry in mongoDB by password entry ID
      await updatePasswordEntryByDocID(passwordEntryArr[i].docID,passwordEntryArr[i]);
    };
    res.status(200);
  }else{
    res.status(400).json({'message':'passwords do not match!'});
  };
});