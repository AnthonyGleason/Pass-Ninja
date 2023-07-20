import jwt from 'jsonwebtoken';

//issue jwt tokens
export const issueToken = function(vault:any){
  return jwt.sign({
    vault: vault,
  },
  process.env.SECRET as jwt.Secret
  ,{
    // for testing tokens will expire in 1 day from issue time
    //in the future this will need to be something more like 5-10 minutes to protect users from stolen jwt tokens and will display a session has expired error please login again if the user tries to access anything with an expired token.
    expiresIn: '1d', 
  });
};

//invalidated jwt tokens will be added to this array, tokens will expire in 5-10 minutes from issue so there is no need for a long term invalidatedTokens document in mongoDB or similar.
export const invalidatedTokens: String[] = [];