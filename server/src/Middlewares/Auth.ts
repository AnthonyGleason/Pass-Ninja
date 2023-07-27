import { NextFunction, Response } from "express";
import { customRequest } from "../Interfaces/interfaces";
import jwt from 'jsonwebtoken';
import { invalidatedTokens } from "../Helpers/auth";

//authenticates jwt tokens
export const authenticateToken = function(req:customRequest, res:Response, next:NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  //handle token does not exist or token is revoked
  if (!token || invalidatedTokens.includes(token)) {
    return res.status(401).json({ 
      isValid: false,
      message: 'Unauthorized',
    });
  };
  jwt.verify(token, process.env.SECRET as jwt.Secret, (err:any, payload:any) => {
    if (err) {
      return res.status(403).json({
        isValid: false,
        message: 'Forbidden',
      });
    };
    //payload is assigned in the issueToken() function above
    req.payload = payload;
    req.token = token;
    next();
  });
};