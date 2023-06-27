import {Schema,Types,model} from 'mongoose';
const SubscriptionSchema = new Schema({
  vault:{
    type: Schema.Types.ObjectId,
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
    type: Types.ObjectId,
    required: true,
  }
});

module.exports = model('Subscription',SubscriptionSchema);