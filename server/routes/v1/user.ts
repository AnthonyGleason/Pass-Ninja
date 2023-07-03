import express from 'express';
import {Response,NextFunction} from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import { CustomRequest, Timestamp, User} from '../../interfaces/interfaces';
import { authenticateToken, generateHashedPassword, invalidatedTokens, issueToken } from '../../auth';
import { createUser, getUserByDocID, getUserByEmail, updateUserByUserID } from '../../controllers/User';
import { createTimestamp, getTimestampByDocID } from '../../controllers/Timestamp';
import { createVaultForUserID, getVaultByUserID } from '../../controllers/Vault';
import { createSubscription, getSubscriptionByVaultID, updateSubscriptionByDocID } from '../../controllers/Subscription';
import { updateTimestampByDocID } from '../../controllers/Timestamp';

export const userRouter = express.Router();
//validate token
userRouter.get('/verify',authenticateToken,(req:CustomRequest, res: Response, next:NextFunction)=>{
  res.status(200).json({'isValid': true});
});

//register, create a new vault for the signed in user storing hashed password as the master password
userRouter.post('/register',async (req:CustomRequest, res: Response, next:NextFunction)=>{
  //destructure request body
  const {
    firstName,
    lastName,
    email,
    password,
    passwordConfirm
  }:{
    firstName:string,
    lastName:string,
    email:string,
    password:string,
    passwordConfirm:string
  } = req.body;
  //check to see if passwords match
  if (password===passwordConfirm){
    const timestamp = await createTimestamp(new Date(),new Date());
    //create new user
    const user = await createUser(firstName,lastName,email,timestamp._id);
    const hashedPassword:string = await generateHashedPassword(password);
    //create new vault
    const vault = await createVaultForUserID(user._id,hashedPassword,timestamp._id);
    const token = issueToken(user,vault);
    res.status(200).json({
      'token': token
    });
  };
});

//login
userRouter.post('/login',async (req:CustomRequest,res:Response,next:NextFunction)=>{
  const emailInput:String = req.body.email;
  let token:String = '';
  //get user for email provided in req
  const user = await getUserByEmail(emailInput);
  if (!user) throw new Error(`No user found for email ${emailInput}`);
  //get vault for the user 
  const vault = await getVaultByUserID(user._id);
  if (!vault) throw new Error(`No vault found for user ${user._id}`);
  //compared hashed master password in the users vault to plaintext password provided by user
  if (await bcrypt.compare(req.body.password,vault.masterPassword)){
    token = issueToken(user,vault);
  };
  //additionlly the login must decrypt all the users passwords for then upon succesfully unlocking the vault
  //these passwords will be returned in json format in an array
  res.status(200).json({'token': token});
});

//logout
userRouter.post('/logout',authenticateToken,(req:CustomRequest, res: Response, next:NextFunction)=>{
  const token: String | undefined = req.token;
  if (token){
    //invalidate authentication token
    invalidatedTokens.push(token);
    res.status(200).json({'loggedOut': true});
  }else{
    res.status(401).json({'loggedOut': false});
  };
});

//get current user account info
userRouter.get('/info',authenticateToken, async (req:CustomRequest, res: Response, next:NextFunction)=>{
  const user = await getUserByDocID(req.payload.user._id);
  //return the current user's user document
  res.status(200).json({'user': user});
});

//update user account info
userRouter.put('/info',authenticateToken,async(req:CustomRequest, res: Response, next:NextFunction)=>{
  //destructure inputs
  const { email, firstName, lastName }: { email: String; firstName: String; lastName: String } = req.body;
  //check to see if an account already exists with that email
  if (!await getUserByEmail(email)){
    //update the email, first name and last name associated with the user account
    let user = await getUserByDocID(req.payload.user._id);
    user.firstName=firstName;
    user.lastName=lastName;
    user.email=email;
    const updatedUser = await updateUserByUserID(req.payload.user._id,user);
    //update the timestamp
    let timestamp = await getTimestampByDocID(user.timestamp);
    timestamp.dateModified = new Date();
    const updatedTimestamp = await updateTimestampByDocID(timestamp._id,timestamp);
    res.status(200).json({
      'user': updatedUser,
      'timestamp': updatedTimestamp,
    });
  }else{
    res.status(400).json({'message': `A user already exists with email ${email}`});
  }
});

/* 
  TODO
  Stripe payments must be setup prior to continuing work on this.
  create a toggleSubscription() which takes in subscribe or unsubscribe as an argument and move the subscription code into it to clean this up.
*/

//subscribe, subscribe by updating the subscription status for the currently signed in user
userRouter.put('/subscribe',authenticateToken,async (req:CustomRequest, res: Response, next:NextFunction)=>{
  const payload: jwt.JwtPayload = req.payload as jwt.JwtPayload;
  const renewalCycle: number = req.body.renewalCycle;
  const getExpirationDate = function(){
    const currentDate:Date = new Date();
    const currentMonth:number = currentDate.getMonth();
    const currentYear:number = currentDate.getFullYear();
    const expMonth:number = (currentMonth + renewalCycle) % 12;
    const expYear:number = currentYear + Math.floor((currentMonth + renewalCycle) / 12)
    return new Date(expYear,expMonth,new Date().getDate());
  };
  /*
  --------------------------------------
  Payments have not been implemented yet.
  The code will continue assuming that 
  stripe payment was successful.
  --------------------------------------
  */
  let subscription;
  let timestamp;
  //attempt to get the current users subscription.
  subscription = await getSubscriptionByVaultID(payload.vault._id);
  //attempt to get the timestamp
  if (subscription) timestamp = await getTimestampByDocID(new Types.ObjectId(subscription.timestamp.toString()));
  /*
  check to see if both the timestamp and subscription were successfully retrieved.
  if they dont exist a new subscription and timestamp will be created (in that order)
  */
  if (subscription && timestamp){
    //update the timestamp locally
    timestamp.dateOfExpiration = getExpirationDate();
    timestamp.dateModified = new Date();
    timestamp.dateOfSubscription = new Date();
    //update the timestamp in mongodb
    await updateTimestampByDocID(timestamp._id,timestamp);
    //update the subscription locally
    subscription.renewalCycle=renewalCycle;
    subscription.isSubscribed=true;
    //update the subscription in mongoDB
    await updateSubscriptionByDocID(subscription._id,subscription);
    res.status(200).json({'subscription': subscription});
  }else{
    //create a timestamp for the subscription
    const timestamp = await createTimestamp(new Date(), new Date(),getExpirationDate(),new Date());
    //create the subscription
    subscription = await createSubscription(
      req.payload.vault._id, //doc id of the currently signed in users vault
      true, //users subscription status
      renewalCycle, //the amount of months in the users subscription cycle
      timestamp._id, //the id of the newly created timestamp
    )
    res.status(200).json({'subscription': subscription});
  }
});
//unsubscribe
userRouter.put('/unsubscribe',authenticateToken,(req:CustomRequest, res: Response, next:NextFunction)=>{
  //unsubscribe by update the subscription status for the currently signed in user
  //update the timestamp
});