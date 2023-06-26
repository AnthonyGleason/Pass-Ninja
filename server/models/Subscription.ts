const SubscriptionSchema = new mongoose.Schema({
  //status obj required
    //isSubscribed required
    //price at time of subscription optional
    //cycle (1,3,6,12) months optional
    //cancel reason optional
    //timestamps ** the below can be used to send offers to users
      //last cancel date
      //last subscribe date
      //date of expiry
  //user docID required
  //date of document creation
});

module.exports = mongoose.model('Subscription',SubscriptionSchema);