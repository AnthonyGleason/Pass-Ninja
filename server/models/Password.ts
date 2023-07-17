import mongoose, {Types} from "mongoose";

const PasswordSchema = new mongoose.Schema({
  vault:{
    type: Types.ObjectId,
    ref: 'vault'
  },
  password:{
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