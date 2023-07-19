//    /v1/api/vaults/:vaultID/
//import type definitions
import { NextFunction, Response } from "express";
import { customRequest} from '../../Interfaces/interfaces';
import express from 'express';
import { authenticateToken } from "../../Configs/auth";

export const passwordRouter = express.Router();

// • POST	/api/v1/vaults/:vaultID/passwords/	create a new password in a vault
passwordRouter.post('/passwords', authenticateToken, (req:customRequest,res:Response,next:NextFunction)=>{

});

// • PUT	/api/v1/vaults/:vaultID/passwords/:passwordID	update a password entry in the vault
passwordRouter.put('/passwords/:passwordID', authenticateToken, (req:customRequest,res:Response,next:NextFunction)=>{
  
});