//    /v1/api/vaults/:vaultID/
//import type definitions
import { NextFunction, Response } from "express";
import { customRequest, passwordDoc} from '../../Interfaces/interfaces';
import express from 'express';
import { authenticateToken } from "../../Middlewares/Auth";
import { createPasswordEntry, getAllPasswordsByVaultID, getPasswordByID, updatePasswordByID } from "../../Controllers/password";

export const passwordRouter = express.Router();

//  GET /api/v1/vaults/passwords get all of the users password entries
passwordRouter.get('/', authenticateToken, async (req:customRequest,res:Response,next:NextFunction)=>{
  console.log(req.payload.vault._id);
  //get vault id from payload
  const vaultID:string = req.payload.vault._id;
  const passwords:passwordDoc[] = await getAllPasswordsByVaultID(vaultID);
  //only proceed if the user is the owner of the vault containing the passwords
  if (passwords[0].vaultID._id.toString()===vaultID){
    //get all passwords with vault id
    res.status(200).json({passwords: passwords});
  }else{
    res.status(401);
  }
});

// • POST	/api/v1/vaults/passwords/	create a new password in a vault
passwordRouter.post('/', authenticateToken, async (req:customRequest,res:Response,next:NextFunction)=>{
  //destructure req.body
  const {
    userName,
    encryptedPassword,
    nickName,
    siteUrl,
  }:{
    userName: string,
    encryptedPassword:string,
    nickName:string,
    siteUrl:string
  } = req.body;
  const vaultID = req.payload.vault._id;
  if (vaultID){
    //create a new password entry
    const passwordDoc = await createPasswordEntry(vaultID,userName,encryptedPassword,nickName,siteUrl);
    //send the new password entry to the client
    res.status(200).json({'password': passwordDoc});
  }else{
    res.status(401);
  };
});

// • PUT	/api/v1/vaults/passwords/:passwordID	update a password entry in the vault
passwordRouter.put('/:passwordID', authenticateToken, async (req:customRequest,res:Response,next:NextFunction)=>{
  //destructure req.body
  const {
    userName,
    encryptedPassword,
    nickName,
    siteUrl,
  }:{
    userName: string,
    encryptedPassword:string,
    nickName:string,
    siteUrl:string
  } = req.body;
  const vaultID:string = req.payload.vault._id;
  const passID:string = req.params.passwordID;
  //get the password entry by password id from mongodb
  const passwordDoc:passwordDoc | null = await getPasswordByID(passID);
  let userOwnsPassword:boolean = false;
  /*
    only procceed if the user is the owner of the password that will be updated.
    I had to nest if statements here because the passwordDoc could be null due to getPasswordByID() not finding any matching documents
  */
  if (passwordDoc){
    if (passwordDoc.vaultID._id.toString()===vaultID){
      userOwnsPassword=true;
    }
  };
  let updatedPasswordDoc = passwordDoc;
  if (userOwnsPassword && updatedPasswordDoc){
    //input new values into the document
    updatedPasswordDoc.userName = userName;
    updatedPasswordDoc.encryptedPassword=encryptedPassword;
    updatedPasswordDoc.nickName=nickName;
    updatedPasswordDoc.siteUrl=siteUrl;
    //update the password entry in mongodb
    await updatePasswordByID(passID,updatedPasswordDoc);
    //send the updated password to the client
    res.status(200).json({password: updatedPasswordDoc});
  };
});

// GET /api/v1/vaults/passwords/:passwordID get the data for a single password entry
passwordRouter.get('/:passwordID',authenticateToken, async (req:customRequest,res:Response,next:NextFunction)=>{
  //get password ID from the route
  const passwordID:string = req.params.passwordID;
  //get password from mongodb based on the password id
  const password:passwordDoc | null = await getPasswordByID(passwordID);
  let userOwnsPassword = false;
  if (password){
    if (password.vaultID._id.toString()===req.payload.vault._id) userOwnsPassword = true;
  }
  //only proceed if the user is the owner of the vault containing the password
  if (userOwnsPassword){
    res.status(200).json({password: password});
  }else{
    res.status(401);
  }
});