import { CustomRequest } from "./interfaces/interfaces";
import { Response,NextFunction } from "express";
import jwt from 'jsonwebtoken';
//authenticates jwt tokens
export const authenticateToken = function(req:CustomRequest, res:Response, next:NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  //handle token does not exist or token is revoked
  if (!token || invalidatedTokens.includes(token)) {
    return res.status(401).json({ error: 'Unauthorized' });
  };
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as jwt.Secret, (err, payload) => {
    if (err) {
      return res.status(403).json({ error: 'Forbidden' });
    };
    //payload is assigned in the request for use in routes by accessing req.payload
    req.payload = payload;
    req.token = token;
    next();
  });
};
//this is good for now but I will need to create a document on mongodb so the invalidated tokens persist across instances
export const invalidatedTokens: String[] = [];