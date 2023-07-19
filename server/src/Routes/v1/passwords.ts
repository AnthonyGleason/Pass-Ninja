//    /v1/api/vaults/:vaultID/
//import type definitions
import { NextFunction, Response } from "express";
import { customRequest, passwordDoc} from '../../Interfaces/interfaces';
import express from 'express';
import { authenticateToken } from "../../Configs/auth";
import { createPasswordEntry, getPasswordByID, updatePasswordByID } from "../../Controllers/password";

export const passwordRouter = express.Router();

// • POST	/api/v1/vaults/:vaultID/passwords/	create a new password in a vault
passwordRouter.post('/passwords', authenticateToken, async (req:customRequest,res:Response,next:NextFunction)=>{
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

// • PUT	/api/v1/vaults/:vaultID/passwords/:passwordID	update a password entry in the vault
passwordRouter.put('/passwords/:passwordID', authenticateToken, async (req:customRequest,res:Response,next:NextFunction)=>{
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
  const passwordDoc = await getPasswordByID(passID);
  let updatedPasswordDoc = passwordDoc;
  if (passwordDoc){
    if (passwordDoc.vaultID===vaultID && updatedPasswordDoc){
      //input new values into the document
      updatedPasswordDoc.userName = userName;
      updatedPasswordDoc.encryptedPassword=encryptedPassword;
      updatedPasswordDoc.nickName=nickName;
      updatedPasswordDoc.siteUrl=siteUrl;
      //update the password entry in mongodb
      await updatePasswordByID(passID,updatedPasswordDoc);
      //send the updated password to the client
      res.status(200).json({password: updatedPasswordDoc});
    }else{
      res.status(401);
    }
  }else{
    res.status(401);
  };
});