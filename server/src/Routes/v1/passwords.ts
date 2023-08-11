//    /v1/api/vaults/:vaultID/
//import type definitions
import { NextFunction, Response } from "express";
import { customRequest, passwordDoc} from '../../Interfaces/interfaces';
import express from 'express';
import { authenticateToken } from "../../Middlewares/Auth";
import { createPasswordEntry, deletePasswordByID, getAllPasswordsByVaultID, getPasswordByID, updatePasswordByID } from "../../Controllers/password";

export const passwordRouter = express.Router();

//  GET /api/v1/vaults/passwords get all of the users password entries
passwordRouter.get('/', authenticateToken, async (req:customRequest,res:Response,next:NextFunction)=>{
  //get vault id from payload
  const vaultID:string = req.payload.vault._id;
  const passwords:passwordDoc[] = await getAllPasswordsByVaultID(vaultID);
  res.status(200).json({passwords: passwords});
});

// • POST	/api/v1/vaults/passwords/	create a new password in a vault
passwordRouter.post('/', authenticateToken, async (req:customRequest,res:Response,next:NextFunction)=>{
  //destructure req.body
  const {
    userName,
    encryptedPassword,
    nickName,
    siteUrl,
    encryptedNotes,
  }:{
    userName: string,
    encryptedPassword:string,
    nickName:string,
    siteUrl:string,
    encryptedNotes:string
  } = req.body;
  const vaultID = req.payload.vault._id;
  let validatedNickName:string;
  //nickname is used to search through passwords so it is needed, if it was left blank replace it with untitled.
  nickName==='' ? validatedNickName='Untitled Password' : validatedNickName=nickName;
  if (vaultID){
    //create a new password entry
    const passwordDoc = await createPasswordEntry(vaultID,userName,encryptedPassword,validatedNickName,siteUrl,encryptedNotes);
    //send the new password entry to the client
    res.status(200).json({'password': passwordDoc});
  }else{
    res.status(401);
  };
});

// DELETE /api/v1/vaults/passwords/:passwordID delete a password entry in the vault
passwordRouter.delete('/:passwordID',authenticateToken, async(req:customRequest,res:Response,next:NextFunction)=>{
  //get the passwordID from the request route
  const passwordID:string = req.params.passwordID;
  const vaultID:string = req.payload.vault._id;
  const passwordDoc:passwordDoc | null = await getPasswordByID(passwordID);
  if (passwordDoc){
    //verify user owns the password
    if (passwordDoc.vaultID._id.toString()===vaultID){
      await deletePasswordByID(passwordID);
      res.status(200).json({'message': `Removed a password with id ${passwordID}.`});
    }else{
      res.status(401);
    };
  }else{
    res.status(404);
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
    encryptedNotes
  }:{
    userName: string,
    encryptedPassword:string,
    nickName:string,
    siteUrl:string,
    encryptedNotes:string
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
    updatedPasswordDoc.encryptedNotes=encryptedNotes;
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