import {Schema,model} from 'mongoose';
const TimestampSchema = new Schema({
  dateModified:{
    type: Date,
    required: true,
    default: Date.now(),
  },
  dateCreated:{
    type: Date,
    required: true,
    default: Date.now(),
  },
  dateOfExpiration:{
    type:Date,
  },
  dateOfSubscription:{
    type:Date,
  }
});
//exporting the instance to be used in other models where required
export const TimestampModel = model('TimeStamp',TimestampSchema);