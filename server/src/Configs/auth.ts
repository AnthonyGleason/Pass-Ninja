import jwt from 'jsonwebtoken';

//issue jwt tokens
export const issueToken = function(vault:any){
  return jwt.sign({
    vault: vault,
  },process.env.SECRET as jwt.Secret);
};

//invalidated jwt tokens will be added to this array (in the future i could create a document on mongoDB for invalidated tokens)
export const invalidatedTokens: String[] = [];