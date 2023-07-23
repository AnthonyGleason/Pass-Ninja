//    /v1/api/
//import type definitions
import { NextFunction, Response } from "express";
import { customRequest} from '../../Interfaces/interfaces';

import express from "express";
import { vaultsRouter } from "./vaults";

export const apiRouter = express.Router();

//greeting
apiRouter.get('/',(req: customRequest,res: Response,next:NextFunction)=>{
  res.status(200).json({'messasge':'Welcome to the PassNinja api!'});
});

apiRouter.use('/vaults',vaultsRouter);