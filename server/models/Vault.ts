import {Schema,Types,model} from 'mongoose';
const VaultSchema = new Schema({
  user:{
    type: Types.ObjectId,
    required: true,
  },
  //master password is a stored as hashed version of the users plain text master password
  masterPassword:{
    type: String,
    required: true,
  },
  timestamp:{
    type: Types.ObjectId,
    required: true
  }
})

module.exports = model('Vault',VaultSchema);