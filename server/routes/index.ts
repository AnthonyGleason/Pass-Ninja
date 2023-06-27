import express from 'express';
import {Request,Response,NextFunction} from 'express';
export const indexRouter = express.Router();
/* GET home page. */
indexRouter.get('/', function(req: Request, res:Response, next:NextFunction) {
  res.status(200)
});