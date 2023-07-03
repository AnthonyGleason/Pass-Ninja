import express from 'express';
import { Response,NextFunction } from 'express';
import { CustomRequest } from '../../interfaces/interfaces';
import { authenticateToken, encryptPassword , generatePassword} from '../../auth';
import {Types} from 'mongoose';
import { createPasswordEntry, getAllPasswordEntriesByVaultID} from '../../controllers/PasswordEntry';
import { removePasswordEntryByDocID } from '../../controllers/PasswordEntry';
import { createTimestamp } from '../../controllers/Timestamp';
export const passwordRouter = express.Router();

//create a new password entry for logged in user
passwordRouter.post('/',authenticateToken,async (req:CustomRequest, res: Response, next:NextFunction)=>{
  //get user inputs from req.body
  const password:string = req.body.password;
  const masterPassword:string = req.body.masterPassword;
  const siteURL:string = req.body.siteURL;
  //if the optional argument for the password entry nickname is provided by the user it will be updated in the next conditional statement
  let nickname:string;
  let passwordEntry:Document;
  const vaultID = req.payload.vault._id;
  const encryptedPassword = encryptPassword(password,masterPassword);
  const timestamp = await createTimestamp(new Date(), new Date());
  if (req.body.nickname){
    nickname = req.body.nickname;
    passwordEntry = await createPasswordEntry(siteURL,encryptedPassword,vaultID,timestamp._id,nickname);
  }else{
    passwordEntry = await createPasswordEntry(siteURL,encryptedPassword,vaultID,timestamp._id);
  };
  res.status(200).json({'passwordEntry': passwordEntry});
})

//get all passwords for logged in user
passwordRouter.get('/',authenticateToken,async (req:CustomRequest, res: Response, next:NextFunction)=>{
  res.status(200).json({'passwords': await getAllPasswordEntriesByVaultID(req.payload.vault._id)});
});

//update an existing password entry
passwordRouter.put('/:passwordEntry',authenticateToken,(req:CustomRequest, res: Response, next:NextFunction)=>{
  //destructure req.body
  //confirm passwords match
    //get the password entry by docID
    //update the password entry locally
    //update the password entry in mongoDB
  //return to the user the updated password entry
})

//delete a password entry
passwordRouter.delete('/:passwordEntry',authenticateToken,async (req:CustomRequest, res: Response, next:NextFunction)=>{
  const passwordID:Types.ObjectId = req.body.passwordID;
  await removePasswordEntryByDocID(passwordID);
  res.status(200);
})

// generate a secure password the user can use server side within user constraints
passwordRouter.get('/generate',authenticateToken,(req:CustomRequest, res: Response, next:NextFunction)=>{
  const {
    minLength,
    maxLength,
    specialChars,
    upperCases,
    numbers,
  }:{
    minLength:number,
    maxLength:number,
    specialChars:boolean,
    upperCases:boolean,
    numbers:boolean,
  } = req.body;
  const password = generatePassword(minLength,maxLength,specialChars,upperCases,numbers);
  res.json({'password': password});
})