//import type definitions
import { NextFunction, Response } from "express";
import { customRequest } from '../../interfaces/interfaces';
//create router
import express from 'express';
export const apiRouter = express.Router();

//greeting
apiRouter.get('/',(req: customRequest,res: Response,next:NextFunction)=>{
  res.status(200).json({'messasge':'Welcome to the PassNinja api!'});
});