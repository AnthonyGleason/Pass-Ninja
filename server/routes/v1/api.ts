//import type definitions
import { NextFunction, Response } from "express";
import { CustomRequest } from '../../interfaces/interfaces';
//create router
import express from 'express';
import { userRouter } from "./user";
import { vaultRouter } from "./vault";
export const apiRouter = express.Router();

//use user route
apiRouter.use('/users',userRouter);
//use vault route
apiRouter.use('/vaults',vaultRouter);

//greeting
apiRouter.get('/',(req: CustomRequest,res: Response,next:NextFunction)=>{
  res.status(200).json({'messasge':'Welcome to the PassNinja api!'});
});