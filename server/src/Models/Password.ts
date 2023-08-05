import mongoose, {Types} from "mongoose";

const PasswordSchema = new mongoose.Schema({
  vaultID:{
    type: Types.ObjectId,
    ref: 'Vault'
  },
  userName:{
    type:String,
  },
  encryptedPassword:{ //hashed using crypto js library client side
    type:String,
  },
  encryptedNotes:{  //hashed using crypto js library client side
    type:String,
  },
  nickName:{
    type:String,
  },
  siteUrl:{
    type:String,
  }
});

export const PasswordModel = mongoose.model('Password',PasswordSchema);