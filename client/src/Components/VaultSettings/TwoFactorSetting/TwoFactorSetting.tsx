import React,{useState,useEffect} from "react";
import { VaultController } from "../../../Classes/VaultController";

export default function TwoFactorSetting({vaultController}:{vaultController:VaultController}){
  const [twoFactorQrCode,setTwoFactorQrCode] = useState<string>('');
  const [otpInput, setOtpInput] = useState<string>('');
  const [masterPasswordInput, setMasterPasswordInput] = useState<string>('');
  
  useEffect(()=>{
    populateTwoFactorSetupCode()
  },[]);


  const handleVerifyTwoFactor = async function(){
    await fetch('http://localhost:5000/v1/api/vaults/verify2FA',{
      method: 'PUT',
      headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
      },
      body: JSON.stringify({
        otpInputKey: otpInput,
        masterPassword: masterPasswordInput
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
        masterPassword: masterPasswordInput
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
  }

  if (vaultController.isTwoFactorEnabled){
    return(
      <div>
        <form>
          <h3>Two-Factor Authentication</h3>
          <p>Disable Two-Factor Authentication</p>
          <p>Note: Two-factor authentication will not be removed from your account until you verify your access to your authenticator and enter your current master password.</p>
          <input min={6} max={6} placeholder='Enter One Time Passcode From Authenticator' type='number'value={otpInput} onChange={(e)=>{setOtpInput(e.target.value)}} />
          <input type='text' placeholder="Enter your current master password." value={masterPasswordInput} onChange={(e)=>{setMasterPasswordInput(e.target.value)}} />
          <button type='button' onClick={()=>{handleRemoveTwoFactor()}}>Submit</button>
        </form>
      </div>
    )
  }else{
    return(
      <div>
        <form>
          <h3>Two-Factor Authentication</h3>
          <p>Enable Two-Factor Authentication</p>
          <p>To begin please scan the qr code below in the authenticator of your choice!</p>
          <img src={twoFactorQrCode} alt='two factor authentication qr code' />
          <p>Once you have successfully connected your authentication app enter your 6 digit one time passcode below.</p>
          <p>Note: Two-factor authentication will not be applied to your account until you verify your access to your authenticator and enter your current master password.</p>
          <input min={6} max={6} placeholder='Enter One Time Passcode From Authenticator.' type='number'value={otpInput} onChange={(e)=>{setOtpInput(e.target.value)}} />
          <input type='text' placeholder="Enter your current master password." value={masterPasswordInput} onChange={(e)=>{setMasterPasswordInput(e.target.value)}} />
          <button type='button' onClick={()=>{handleVerifyTwoFactor()}}>Submit</button>
        </form>
      </div>
    )
  }
}