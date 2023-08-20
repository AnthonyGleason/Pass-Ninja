import mongoose, {Types} from "mongoose";

const PasswordSchema = new mongoose.Schema({
  vaultID:{
    type: Types.ObjectId,
    ref: 'Vault'
  },
  userName:{
    type:String,
  },
  encryptedPassword:{
    type:String,
  },
  encryptedNotes:{
    type:String,
  },
  nickName:{
    type:String,
  },
  siteUrl:{
    type:String,
  },
  expiresOn:{
    type: Date,
    default: () => {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + 90);
      return currentDate;
    },
  },
});

export const PasswordModel = mongoose.model('Password',PasswordSchema);