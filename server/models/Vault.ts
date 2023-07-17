import mongoose, { Types } from "mongoose";

const VaultSchema = new mongoose.Schema({
  user:{
    type: Types.ObjectId,
    ref: 'user',
  },
  masterPassword:{
    type:String,
  },
  nickName:{
    type:String,
  }
});

export const VaultModel = mongoose.model('Vault',VaultSchema);