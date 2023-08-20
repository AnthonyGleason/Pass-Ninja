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
  //if the nickname was left blank by the user set the nickname to untitled password
  const validatedNickName:string = nickName || 'Untitled Password';
  //create a new password entry
  const passwordDoc = await createPasswordEntry(vaultID,userName,encryptedPassword,validatedNickName,siteUrl,encryptedNotes);
  //send the new password entry to the client
  res.status(200).json({'password': passwordDoc});
});

// DELETE /api/v1/vaults/passwords/:passwordID delete a password entry in the vault
passwordRouter.delete('/:passwordID',authenticateToken, async(req:customRequest,res:Response,next:NextFunction)=>{
  //get the passwordID from the request route
  const passwordID:string = req.params.passwordID;
  const userVaultID:string = req.payload.vault._id;
  const passwordDoc:passwordDoc | null = await getPasswordByID(passwordID);
  const passwordVaultID:string = passwordDoc?.vaultID._id.toString();
  if (
    passwordDoc && //verify a password doc was found
    passwordVaultID === userVaultID // verify the user making the request owns the password
  ){
    await deletePasswordByID(passwordID)
    .then(()=>{
      res.status(200).json({'message': `Removed a password with id ${passwordID}.`});
    });
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

  const userVaultID:string = req.payload.vault._id;
  const passwordID:string = req.params.passwordID;
  //get the password entry by password id from mongodb
  const passwordDoc:passwordDoc | null = await getPasswordByID(passwordID);
  const passwordVaultID: string = passwordDoc?.vaultID?._id.toString() || '';
  let userOwnsPassword:boolean | null =
    passwordDoc && //password doc was found
    passwordVaultID === userVaultID //the password's vault is matches the user vaultID
  //make a copy of the password doc
  let updatedPasswordDoc = passwordDoc;
  if (userOwnsPassword && updatedPasswordDoc){
    //input new values into the password document
    updatedPasswordDoc.userName = userName;
    updatedPasswordDoc.encryptedPassword=encryptedPassword;
    updatedPasswordDoc.nickName=nickName;
    updatedPasswordDoc.siteUrl=siteUrl;
    updatedPasswordDoc.encryptedNotes=encryptedNotes;
    // update the expiration date for the password to be 90 days from the current time
    updatedPasswordDoc.expiresOn = function() {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + 90);
      return currentDate;
    }();
    //update the password entry in mongodb
    await updatePasswordByID(passwordID,updatedPasswordDoc);
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
  const passwordVaultID = password?.vaultID._id.toString();
  const userVaultID = req.payload.vault._id;
  if (
    password && //a password was found
    passwordVaultID === userVaultID // user is the owner of the vault containing the password
  ){
    res.status(200).json({password: password});
  }else{
    res.status(401);
  }
});