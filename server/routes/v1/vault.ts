import express from 'express';
import {Request,Response,NextFunction} from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
export const vaultRouter = express.Router();
//create a new vault for user
//get a vault for the signed in user
//update vault master password

//use password entry route