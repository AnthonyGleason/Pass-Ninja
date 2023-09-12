import express from "express";
import bcrypt from 'bcrypt';

import { NextFunction, Response } from "express";
import { customRequest, passwordDoc, vaultDoc } from '../../Interfaces/interfaces';

import { invalidatedTokens, generateHashedPassword, loginExistingUser, registerNewUser, twoFactorPendingTokens, generateUniqueDemoEmail} from "../../Helpers/auth";
import { createExamplePassword, generatePassword } from "../../Helpers/vault";

import { authenticateToken } from "../../Middlewares/Auth";

import { getVaultByID, getVaultByUserEmail, updateVaultByID } from "../../Controllers/vault";
import { updatePasswordByID } from "../../Controllers/password";
import { passwordRouter } from "./passwords";
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { qrCodeErrorCorrectionLevel, speakeasySecretLength } from "../../Configs/auth";

export const vaultsRouter = express.Router();

// • GET 	/v1/api/vaults/verify	verify the token provided
vaultsRouter.get('/verify', authenticateToken, (req:customRequest,res:Response,next:NextFunction)=>{
  res.status(200).json({
    isValid: true,
    message: 'The provided token has been successfully validated.',
  });
});

// • POST /v1/api/vaults/register create a new vault
vaultsRouter.post('/register',async (req:customRequest,res:Response,next:NextFunction)=>{
  //destructure the request body
  const {
    firstName,
    lastName,
    email,
    masterPassword,
    masterPasswordConfirm,
  }:{
    firstName:string,
    lastName:string,
    email:string,
    masterPassword:string,
    masterPasswordConfirm:string
  } = req.body;
  //create the vault in mongodb
  const vault = await registerNewUser(masterPassword,masterPasswordConfirm,firstName,lastName,email);
  //create a new example password in the users vault (that was just created)
  if (vault) await createExamplePassword(vault._id,masterPassword);
  //generate a token so users can access their vault immediately
  const token:string = await loginExistingUser(email,masterPassword);
  //return the status based on if the token is available
  if (token){
    res.status(200).json({
      'token': token,
    });
  }else{
    res.status(400).json({'message': `There was an error creating an account with email ${email}`});
  };
});

// • POST	/v1/api/vaults/demologin	use the demo user
vaultsRouter.get('/demologin', async (req:customRequest,res:Response,next:NextFunction)=>{
  //using the generate password function generate a random unique email
  const email:string = await generateUniqueDemoEmail();
  const vault = await registerNewUser('demopass','demopass','Demo','User',email);
  //create a new example password in the users vault
  if (vault) await createExamplePassword(vault._id,'demopass');
  await loginExistingUser(email,'demopass')
    .then((token:string)=>{
      res.status(200).json({'token': token});
    })
    .catch((err)=>{
      res.status(500).json({'message': 'an error occured during login'});
      console.log(err);
    });
});

vaultsRouter.post('/login', async (req: customRequest, res: Response, next: NextFunction) => {
  const {
    email,
    masterPassword,
    userOtpInput
  }: {
    email: string,
    masterPassword: string,
    userOtpInput: string
  } = req.body;

  try {
    const vaultDoc: vaultDoc | null = await getVaultByUserEmail(email);

    //a vault doc was found for the provided email
    if (vaultDoc) {
      if (!vaultDoc.twoFactorAuthSecret) {
        // User doesn't have two factor enabled
        const token: string = await loginExistingUser(email, masterPassword);
        res.status(200).json({
          'token': token,
          'otpRequired': false
        });
      } else if (vaultDoc.twoFactorAuthSecret && userOtpInput) {
        // User has two factor enabled and provided OTP
        const isVerified: boolean = speakeasy.totp.verify({
          secret: vaultDoc.twoFactorAuthSecret,
          encoding: 'base32',
          token: userOtpInput,
          window: 1,
        });

        if (isVerified) {
          const token: string = await loginExistingUser(email, masterPassword);
          res.status(200).json({
            token: token
          });
        } else {
          res.status(401).json({
            'message': 'Invalid OTP'
          });
        }
      } else {
        // Two factor is enabled, but OTP not provided
        res.status(401).json({
          'message': 'OTP is required',
          'otpRequired': true
        });
      }
    } else {
      // No vault document found for the provided email
      res.status(404).json({
        'message': 'User not found'
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500);
  }
});

// • POST	/v1/api/vaults/logout	log out of account invalidating the users token
vaultsRouter.post('/logout',authenticateToken,(req:customRequest,res:Response,next:NextFunction)=>{
  if (req.token){
    //get the users token from request token
    const token:String = req.token;
    //add the token to the invalidated tokens array
    invalidatedTokens.push(token);
    res.status(200).json({message: 'You have been logged out.'});
  }else{
    res.status(400).json({message: 'There was an error processing your request, please try again later.'});
  };
});

// PUT /v1/api/vaults/settings update the users vault settings
vaultsRouter.put('/settings',authenticateToken, async(req:customRequest,res:Response,next:NextFunction)=>{
  const {
    updatedMasterPassword,
    updatedMasterPasswordConfirm,
    currentMasterPassword,
    updatedEmail,
    updatedPasswords
  }:{
    updatedMasterPassword?:string,
    updatedMasterPasswordConfirm?:string,
    currentMasterPassword?:string,
    updatedEmail?:string,
    updatedPasswords?:passwordDoc[];
  } = req.body;
  const vault = await getVaultByID(req.payload.vault._id);

  //handle user is updating their vault's master password
  if (
    currentMasterPassword && //user provided a current password
    await bcrypt.compare(currentMasterPassword,req.payload.vault.hashedMasterPassword) && //the user has entered the correct master password
    updatedMasterPassword && //an updated master password was provided
    updatedMasterPasswordConfirm && //an updated master password confirmation was provided
    updatedMasterPassword===updatedMasterPasswordConfirm && //the updated master password matches the confirmation
    updatedPasswords  
  ){
    //for each password update the password document by id with the new password data
    updatedPasswords.forEach(async (password:passwordDoc)=>{
      //users must own the vault associated with the password in order to update that password
      if (req.payload.vault._id===password.vaultID._id) await updatePasswordByID(password._id,password);
    });

    //update the vault master password
    let tempVaultDoc:vaultDoc | null = await getVaultByID(req.payload.vault._id);
    if (tempVaultDoc){
      tempVaultDoc.hashedMasterPassword = await generateHashedPassword(updatedMasterPassword);
      await updateVaultByID(req.payload.vault._id,tempVaultDoc);
    }
  };
  
  //handle user is updating their vault's associated email address
  if (
    updatedEmail && // user has provided an updated email address
    vault // a vault was found for user
  ){
    let updatedVault = vault;
    updatedVault.email = updatedEmail;
    await updateVaultByID(req.payload.vault._id,updatedVault);
  };
  res.status(200).json({'message':'Your settings have been applied.'});
});

// POST  /v1/api/vaults/request2FASetup
vaultsRouter.post('/request2FASetup',authenticateToken,async(req:customRequest,res:Response,next:NextFunction)=>{
  // vault is already pending 2fa
  const pendingToken = twoFactorPendingTokens.find((token) => token.vaultID === req.payload.vault._id);
  if (!pendingToken){
    //generate the two-factor secret
    const speakeasySecret:speakeasy.GeneratedSecret = speakeasy.generateSecret({'length': speakeasySecretLength});
    if (speakeasySecret.otpauth_url){
      //store the secret and user's vault id in the servers pending two factor tokens array
      twoFactorPendingTokens.push({
        'vaultID': req.payload.vault._id, //token is taken from vault id based on provided the jwt session token
        'secret': speakeasySecret
      });
      //create qr code
      QRCode.toDataURL(
        speakeasySecret.otpauth_url,
        {errorCorrectionLevel: qrCodeErrorCorrectionLevel},
        function (err, url) {
          //send the qr code url to the client
          res.status(200).json({'qrCodeUrl': url});
        }
      );
    }else{
      res.status(400);
    };
  }else{
    res.status(409);
  }
});

vaultsRouter.delete('/remove2FA',authenticateToken,async(req:customRequest,res:Response,next:NextFunction)=>{
  const {
    otpInputKey,
    masterPasswordInput
  }:{
    otpInputKey:string,
    masterPasswordInput:string
  } = req.body;
  const vault:vaultDoc | null = await getVaultByUserEmail(req.payload.vault.email);
  if (
    vault && //vault is found
    vault.twoFactorAuthSecret && // user has two factor authentication enabled
    await bcrypt.compare(masterPasswordInput,vault.hashedMasterPassword) && //master password was successfully entered by the user
    speakeasy.totp.verify({ //and finally verify the otp was entered correctly by the user
      secret: vault.twoFactorAuthSecret,
      encoding: 'base32',
      token: otpInputKey,
      window: 1,
    })
  ){
    let updatedVault:vaultDoc = vault;
    //remove 2fa from the users account
    updatedVault.twoFactorAuthSecret = '';
    await updateVaultByID(req.payload.vault._id,updatedVault)
      .then(()=>{
        res.status(200).json({'message':'Two-Factor Authentication was sucessfully removed from your account.'})
      });
  }else{
    res.status(400).json({'message': 'An error occured when attempting to remove 2FA from your account.'});
  };
});

// PUT /v1/api/vaults/verifyOTP users can verify their pending two factor qr code
vaultsRouter.put('/verifyOTP', authenticateToken, async (req: customRequest, res: Response, next: NextFunction) => {
  const {
    otpInputKey,
    masterPasswordInput
  } = req.body;
  const vaultID: string = req.payload.vault._id;
  let vault: vaultDoc | null = await getVaultByID(vaultID);
  // Find the pending secret key for 2FA setup
  const pendingToken = twoFactorPendingTokens.find((token) => token.vaultID === vaultID);
  
  if (
    pendingToken && //a pending token was found in the two factor pending tokens array
    pendingToken.secret &&  //the token found has a secret property
    vault &&  // a vault was found
    !vault.twoFactorAuthSecret //the user does not have two factor enabled
  ) {
    const pendingSecretKey = pendingToken.secret.base32;

    // Verify OTP provided by user
    const isOTPVerified: boolean = speakeasy.totp.verify({
      secret: pendingSecretKey,
      encoding: 'base32',
      token: otpInputKey,
      window: 1,
    });

    // Determine if vault should be updated or not
    if (
      vault && // A vault document was found for the vault id in payload
      isOTPVerified && // User entered correct OTP
      await bcrypt.compare(masterPasswordInput, vault.hashedMasterPassword) // User's inputted password matches the hashed password
    ) {
      // Update vault with the twoFactorAuthSecret
      vault.twoFactorAuthSecret = pendingSecretKey;
      updateVaultByID(vaultID, vault);

      // Perform cleanup, remove the pending token from the pending two factor tokens array
      for (let i = 0; i < twoFactorPendingTokens.length; i++) {
        if (twoFactorPendingTokens[i].vaultID === req.payload.vault._id) {
          twoFactorPendingTokens.splice(i,1);
          break; // Stop loop once found
        };
      };
      res.status(200).json({ 'verified': true });
    } else {
      res.status(401).json({ 'verified': false });
    };
  } else {
    //pending token is not found
    res.status(404).json({ 'verified': false });
  };
});

// • GET	/v1/api/vaults/		get the most recent version of the users vault data using token payload
vaultsRouter.get('/',authenticateToken,async (req:customRequest,res:Response,next:NextFunction)=>{
  //get the current user's vault from mongodb
  const vault: vaultDoc | null = await getVaultByUserEmail(req.payload.vault.email);
  if (vault){
    res.status(200).json({vault: vault});
  }else{
    res.status(400).json({message: 'There was an issue retrieving user data.'});
  };
});

vaultsRouter.use('/passwords',passwordRouter);