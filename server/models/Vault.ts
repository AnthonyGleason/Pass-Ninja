import mongoose, { Types } from "mongoose";

const VaultSchema = new mongoose.Schema({
  userID:{
    type: Types.ObjectId,
    ref: 'User',
  },
  masterPassword:{
    type:String,
  },
  nickName:{
    type:String,
  }
});

export default mongoose.model('Vault',VaultSchema);