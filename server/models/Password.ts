import mongoose, {Types} from "mongoose";

const PasswordSchema = new mongoose.Schema({
  vault:{
    type: Types.ObjectId,
    ref: 'Vault'
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

export default mongoose.model('Password',PasswordSchema)