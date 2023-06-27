import { TimestampModel } from "../models/Timestamp";
import { Types } from "mongoose";
import { Timestamp } from "../interfaces/interfaces";
//create a new timestamp
export const createTimestamp = async function(
  dateModified: Date,
  dateCreated: Date,
  dateOfExpiration?: Date,
  dateOfSubscription?: Date,
){
  return await TimestampModel.create({
    dateModified: dateModified,
    dateCreated: dateCreated,
    dateOfExpiration: dateOfExpiration,
    dateOfSubscription: dateOfSubscription
  })
};
//update a timestamp
export const updateTimestampByDocID = async function(docID: Types.ObjectId, updatedTimestamp: Timestamp){
  return await TimestampModel.findByIdAndUpdate(docID,updatedTimestamp);
}
//get a timestamp by timestamp docID
export const getTimestampByDocID = async function(docID: Types.ObjectId){
  return await TimestampModel.findById(docID);
};
//delete a timestamp by timestamp docID
export const deleteTimestampByDocID = async function(docID: Types.ObjectId){
  return await TimestampModel.findByIdAndDelete(docID);
}