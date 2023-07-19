import { customRequest } from "../Interfaces/interfaces";
import { Response,NextFunction } from "express";
import jwt from 'jsonwebtoken';

//issue jwt tokens
export const issueToken = function(vault:any){
  return jwt.sign({
    vault: vault,
  },process.env.SECRET as jwt.Secret);
};

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
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as jwt.Secret, (err:any, payload:any) => {
    if (err) {
      return res.status(403).json({
        isValid: true,
        message: 'Forbidden',
      });
    };
    //payload is assigned in the issueToken() function above
    req.payload = payload;
    req.token = token;
    next();
  });
};

//invalidated jwt tokens will be added to this array (in the future i could create a document on mongoDB for invalidated tokens)
export const invalidatedTokens: String[] = [];