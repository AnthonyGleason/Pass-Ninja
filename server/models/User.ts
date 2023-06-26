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
  masterPassword:{ //store hashed master password
    type: String,
    required: true,
    min: 16,
    max: 50,
  },
  dateCreated:{
    type: Date,
    required: true,
    default: Date.now(),
  },
  frozen:{
    type: Boolean,
    default: false,
  },
})

module.exports = mongoose.model('User',UserSchema);