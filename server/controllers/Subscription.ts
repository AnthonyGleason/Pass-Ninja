import {Types} from 'mongoose';
import { Subscription } from '../interfaces/interfaces';
import { SubscriptionModel } from '../models/Subscription';
//create a subscription
export const createSubscription = async function(
  vault: Types.ObjectId,
  isSubscribed: Boolean,
  renewalCycle: Number,
  timestamp: Types.ObjectId,
){
  return await SubscriptionModel.create({
    vault: vault,
    isSubscribed: isSubscribed,
    renewalCycle: renewalCycle,
    timestamp: timestamp,
  })
};
//update a subscription by subscription docID
export const updateSubscriptionByDocID = async function(docID: Types.ObjectId, updatedSubscription:Subscription){
  return await SubscriptionModel.findByIdAndUpdate(docID,updatedSubscription);
};
//get a subscription by subscription docID
export const getSubscriptionByDocID = async function(docID: Types.ObjectId){
  return await SubscriptionModel.findById(docID);
};
//get a subscription by vault docID
export const getSubscriptionByVaultID = async function(docID: Types.ObjectId){
  return await SubscriptionModel.findOne({'vault': docID});
};
//delete a subscription by docID
export const deleteSubscriptionByDocID = async function(docID: Types.ObjectId){
  return await SubscriptionModel.findByIdAndDelete(docID);
}