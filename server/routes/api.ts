//import type definitions
import { NextFunction, Request, Response } from "express";
//create router
import express from 'express';
export const apiRouter = express.Router();

//greeting
apiRouter.get('/',(req: Request,res: Response,next:NextFunction)=>{
  res.status(200).json({'messasge':'Welcome to the PassNinja api!'});
});

//validate token
//use user route
//use vault route