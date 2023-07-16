import mongoose, { Types } from "mongoose";

const VaultSchema = new mongoose.Schema({
  user:{
    type: Types.ObjectId,
    ref: 'User',
  },
  masterPassword:{
    type:String,
  }
});

export default mongoose.model('Vault',VaultSchema);