import {mongoose} from '../app';
import {TimestampModel} from './Timestamp';
const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    min: 1,
    required: true,
  },
  lastName:{
    type: String,
    min: 1,
    required: true,
  },
  email:{
    type: String,
    required: true,
    validator: function(value: string) {
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      return emailRegex.test(value);
    },
  },
  timestamp:{
    type: TimestampModel,
    required: true,
  }
})

module.exports = mongoose.model('User',UserSchema);