import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  firstName:{
    type: String,
  },
  lastName:{
    type: String,
  },
  email:{
    type: String,
  }
});

export const UserModel = mongoose.model('User',UserSchema)