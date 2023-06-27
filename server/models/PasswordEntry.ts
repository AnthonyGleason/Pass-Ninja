import {mongoose} from '../app';
import { TimestampModel } from './Timestamp';
const passwordEntrySchema = new mongoose.Schema({
  siteURL:{
    type: String,
    required: true,
  },
  /*
  Some quick notes about the password stored here
  1) it is hashed with the users vault master password
  2) users need to enter their master password again to create new password entries in a vault
  3) the password entries will be decrypted using bcrypt when the user intially unlocks their vault
  */
  password:{
    type: String,
    required: true,
  },
  nickname:{
    type: String,
  },
  vault:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  timestamp:{
    type: TimestampModel,
    required: true
  }
});

module.exports = mongoose.model('PasswordEntry',passwordEntrySchema);