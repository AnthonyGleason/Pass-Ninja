import mongoose from "mongoose";

const VaultSchema = new mongoose.Schema({
  firstName:{
    type: String,
  },
  lastName:{
    type: String,
  },
  email:{
    type: String,
  },
  hashedMasterPassword:{ //hashed using bcrypt
    type:String,
  }
});

export const VaultModel = mongoose.model('Vault',VaultSchema);