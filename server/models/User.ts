import {Schema,Types,model} from 'mongoose';
const UserSchema = new Schema({
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
    type: Types.ObjectId,
    required: true,
  }
});
export const UserModel = model('User',UserSchema);