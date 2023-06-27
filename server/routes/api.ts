//import type definitions
import { NextFunction, Request, Response } from "express";
//create router
const express = require('express');
const router = new express.Router();

//unauthenticated routes
//user greeting
router.get('/',(req: Request,res: Response,next:NextFunction)=>{
  res.status(200).json({'messasge':'Welcome to the PassNinja api!'});
});

//authenticated routes
//validate token
//login
//logout
//register
//subscribe
//unsubscribe
//create a new vault
//create a new password entry
//update an existing password entry
//delete a password entry
//generate a secure password the user can use server side within user constraints
//update user account
//update master password

//export router for use in app.ts
module.exports = router;