import express from 'express';
import {Request,Response,NextFunction} from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
export const passwordRouter = express.Router();
//create a new password entry
//update an existing password entry
//get all passwords
//generate a secure password the user can use server side within user constraints
//delete a password entry