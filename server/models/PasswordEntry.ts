import {Schema,Types,model} from 'mongoose';
const PasswordEntrySchema:any = new Schema({
  siteURL:{
    type: String,
    required: true,
  },
  password:{
    type: String,
    required: true,
    /*
      Some quick notes about the password stored here
      1) it is hashed with the users vault master password
      2) users need to enter their master password again to create new password entries in a vault
      3) the password entries will be decrypted using bcrypt when the user intially unlocks their vault
    */
  },
  nickname:{
    type: String,
  },
  vault:{
    type: Types.ObjectId,
    required: true,
  },
  timestamp:{
    type: Types.ObjectId,
    required: true
  }
});
export const PasswordEntryModel = model('PasswordEntry',PasswordEntrySchema);