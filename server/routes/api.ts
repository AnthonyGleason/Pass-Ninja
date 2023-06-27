//import type definitions
import { NextFunction, Request, Response } from "express";
//create router
const express = require('express');
const router = new express.Router();

//greeting
router.get('/',(req: Request,res: Response,next:NextFunction)=>{
  res.status(200).json({'messasge':'Welcome to the PassNinja api!'});
});

//validate token
//use user route
//use vault route

//export router for use in app.ts
module.exports = router;