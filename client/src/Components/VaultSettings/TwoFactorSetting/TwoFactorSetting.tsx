import React,{useState,useEffect} from "react";
import { VaultController } from "../../../Classes/VaultController";

export default function TwoFactorSetting({vaultController}:{vaultController:VaultController}){
  const [twoFactorQrCode,setTwoFactorQrCode] = useState<string>('');
  const [otpInput, setOtpInput] = useState<string>('');

  useEffect(()=>{
    populateTwoFactorSetupCode()
  },[]);


  const submitOTP = async function(){
    await fetch('http://localhost:5000/v1/api/vaults/verify2FACode',{
      method: 'PUT',
      headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
      },
      body: JSON.stringify({
        otpInputKey: otpInput
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

  return(
    <div>
      <form>
        <img src={twoFactorQrCode} alt='two factor authentication qr code' />
        <input placeholder='Enter One Time Passcode From Authenticator' type='number'value={otpInput} onChange={(e)=>{setOtpInput(e.target.value)}} />
        <button type='button' onClick={()=>{submitOTP()}}>Submit</button>
      </form>
    </div>
  )
}