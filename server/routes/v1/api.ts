//import type definitions
import { NextFunction, Request, Response } from "express";
//create router
import express from 'express';
import { userRouter } from "./user";
import { vaultRouter } from "./vault";
export const apiRouter = express.Router();

//greeting
apiRouter.get('/',(req: Request,res: Response,next:NextFunction)=>{
  res.status(200).json({'messasge':'Welcome to the PassNinja api!'});
});

//use user route
apiRouter.use('/users',userRouter);
//use vault route
apiRouter.use('/vaults',vaultRouter);