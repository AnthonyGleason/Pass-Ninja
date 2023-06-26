//import type definitions
import { NextFunction, Request, Response } from "express";
//create router
const express = require('express');
const router = new express.Router();

router.get('/',(req: Request,res: Response,next:NextFunction)=>{
  res.status(200).json({'messasge':'Welcome to the PassNinja api!'});
});

//export router for use in app.ts
module.exports = router;