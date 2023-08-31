import React,{useState,useEffect} from "react";
import { VaultController } from "../../../Classes/VaultController";

export default function TwoFactorSetting({vaultController}:{vaultController:VaultController}){
  const [twoFactorQrCode,setTwoFactorQrCode] = useState<string>('');
  const [otpInput, setOtpInput] = useState<string>('');
  const [masterPasswordInput, setMasterPasswordInput] = useState<string>('');
  
  useEffect(()=>{
    /*
      only requests a two factor setup code if two factor is disabled. the server additionally checks and verifies this
      so users cant just overwrite other users 2FA settings
    */
    if (!vaultController.isTwoFactorEnabled) populateTwoFactorSetupCode(); 
  },[]);


  const handleVerifyTwoFactor = async function(){
    await fetch('http://localhost:5000/v1/api/vaults/verifyOTP',{
      method: 'PUT',
      headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
      },
      body: JSON.stringify({
        otpInputKey: otpInput,
        masterPasswordInput: masterPasswordInput
      }),
    }).then((data)=>{
      console.log(data);
    })
  };

  const handleRemoveTwoFactor = async function(){
    await fetch('http://localhost:5000/v1/api/vaults/remove2FA',{
      method: 'DELETE',
      headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
      },
      body: JSON.stringify({
        otpInputKey: otpInput,
        masterPasswordInput: masterPasswordInput
      }),
    }).then((data)=>{
      console.log(data);
    })
  };

  const populateTwoFactorSetupCode = async function(){
    const response = await fetch('http://localhost:5000/v1/api/vaults/request2FASetup',{
      method: 'POST',
      headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
      },
    });
    await response.json()
    .then((data)=>{
      setTwoFactorQrCode(data.qrCodeUrl);
    });
  };

  if (vaultController.isTwoFactorEnabled){
    return(
      <form className="two-factor-setting">
        <h3>Disable Two-Factor Authentication</h3>
        <ol className="two-factor-steps-container">
          <li className="two-factor-step">
            Two-factor authentication will not be removed from your account until you verify your access to your authenticator with a one time password and enter your current master password below.<br />
          </li>
          <li className="two-factor-step">
            <input min={6} max={6} placeholder='Enter One Time Passcode From Authenticator' type='number'value={otpInput} onChange={(e)=>{setOtpInput(e.target.value)}} required/>
            <input type='text' placeholder="Enter your current master password." value={masterPasswordInput} onChange={(e)=>{setMasterPasswordInput(e.target.value)}} required/>
          </li>
        </ol>
        <button type='button' onClick={()=>{handleRemoveTwoFactor()}}>Submit</button>
      </form>
    );
  }else{
    return(
      <form className="two-factor-setting">
        <h3>Enable Two-Factor Authentication</h3>
        <ol className="two-factor-steps-container">
          <li className="two-factor-step">
            To begin please scan the qr code below in the authentication platform of your choice!<br />
            Two popular authentication options are authy and google authenticator.
            <img src={twoFactorQrCode} alt='two factor authentication qr code' />
          </li>
          <li className="two-factor-step">
            Once you have successfully scanned the qr code enter your 6 digit one time passcode below.<br />
            Note: Two-factor authentication will not be applied to your account until you verify your access to your authenticator with a one time passcode and enter your current master password below.
          </li>
          <li className="two-factor-step">
            <input min={6} max={6} placeholder='Enter "One Time Passcode" from authenticator.' type='number'value={otpInput} onChange={(e)=>{setOtpInput(e.target.value)}} required/>
            <input type='text' placeholder="Enter your current master password." value={masterPasswordInput} onChange={(e)=>{setMasterPasswordInput(e.target.value)}} required/>
          </li>
        </ol>
        <button type='button' onClick={()=>{handleVerifyTwoFactor()}}>Submit</button>
      </form>
    );
  };
};