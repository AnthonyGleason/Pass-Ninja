import {mongoose} from '../app';
import { TimestampModel } from './Timestamp';
const SubscriptionSchema = new mongoose.Schema({
  vault:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  isSubscribed:{
    type: Boolean,
    default: false,
  },
  renewalCycle:{
    type: Number,
    validate:{
      validator: function(val: Number){
        const validNumbers:Number[] = [1,3,6,12];
        return validNumbers.includes(val);
      }
    }
  },
  timestamp:{
    type: TimestampModel,
    required: true,
  }
});

module.exports = mongoose.model('Subscription',SubscriptionSchema);