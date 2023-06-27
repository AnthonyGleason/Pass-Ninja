import {mongoose} from '../app';
import {TimestampModel} from './Timestamp';
const VaultSchema = new mongoose.Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  //master password is a stored as hashed version of the users plain text master password
  masterPassword:{
    type: String,
    required: true,
  },
  timestamp:{
    type: TimestampModel,
    required: true
  }
})

module.exports = mongoose.model('Vault',VaultSchema);