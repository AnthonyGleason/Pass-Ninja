import React,{useState,useEffect} from "react";
import { VaultController } from "../../../Classes/VaultController";
import { useNavigate } from "react-router-dom";
import Tooltip from "../../Tooltip/Tooltip";
import { getFetchURL } from "../../../Configs/clientSettings";

export default function TwoFactorSetting({vaultController}:{vaultController:VaultController}){
  const [twoFactorQrCode,setTwoFactorQrCode] = useState<string>('');
  const [otpInput, setOtpInput] = useState<string>('');
  const [masterPasswordInput, setMasterPasswordInput] = useState<string>('');
  const [activeTooltipTerm, setActiveTooltipTerm] = useState<string>('');
  const navigate = useNavigate();
  useEffect(()=>{
    /*
      only requests a two factor setup code if two factor is disabled. the server additionally checks and verifies this
      so users cant just overwrite other users 2FA settings
    */
    if (!vaultController.isTwoFactorEnabled) populateTwoFactorSetupCode(); 
  },[]);


  const handleVerifyTwoFactor = async function(){
    await fetch(`${getFetchURL()}/v1/api/vaults/verifyOTP`,{
      method: 'PUT',
      headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
      },
      body: JSON.stringify({
        otpInputKey: otpInput,
        masterPasswordInput: masterPasswordInput
      }),
    }).then((res)=>{
      if (res.ok){
        navigate('/vault/settings');
      };
    });
  };

  const handleRemoveTwoFactor = async function(){
    await fetch(`${getFetchURL()}/v1/api/vaults/remove2FA`,{
      method: 'DELETE',
      headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
      },
      body: JSON.stringify({
        otpInputKey: otpInput,
        masterPasswordInput: masterPasswordInput
      }),
    }).then((res)=>{
      if (res.ok){
        navigate('/vault/settings')
      };
    });
  };

  const populateTwoFactorSetupCode = async function(){
    const response = await fetch(`${getFetchURL()}/v1/api/vaults/request2FASetup`,{
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
      <form className="two-factor-form">
        <h3>Disable Two-Factor Authentication</h3>
        <ol className="two-factor-steps-container">
          <li className="two-factor-step">
            Two-factor authentication will not be removed from your account until you verify your access to your authenticator with a one time password and enter your current master password below.<br />
          </li>
          <li className="two-factor-step two-factor-input-field">
            <label>Six Digit OTP:</label>
            <input min={6} max={6} type='number'value={otpInput} onChange={(e)=>{setOtpInput(e.target.value)}} required/>
          </li>
          <li className="two-factor-step two-factor-input-field">
            <label>Current Master Password:</label>
            <input type='password' value={masterPasswordInput} onChange={(e)=>{setMasterPasswordInput(e.target.value)}} required/>
          </li>
        </ol>
        <ul>
          <li>
            <button type='button' onClick={()=>{handleRemoveTwoFactor()}}>Submit</button>
          </li>
          <li>
            <button type='button' onClick={()=>{navigate('/vault/settings')}}>Cancel</button>
          </li>
        </ul>
      </form>
    );
  }else{
    return(
      <form className="two-factor-form">
        <h3>Enable Two-Factor Authentication</h3>
        <ol className="two-factor-steps-container">
          <li className="two-factor-step">
            To begin please scan the qr code below in the authentication platform of your choice!<br />
            <img className='qrcode' src={twoFactorQrCode} alt='two factor authentication qr code' />
          </li>
          <li className="two-factor-step">
            Once you have successfully scanned the qr code enter your six digit <Tooltip activeTooltipTerm={activeTooltipTerm} setActiveTooltipTerm={setActiveTooltipTerm} term="One Time Passcode" desc="A One Time Passcode (OTP) is a six digit passcode provided by an authentication platform such as Authy or Google Authenticator. An OTP will typically expire in 1 minute from the time of issue." /> and current password below.<br />
          </li>
          <li className="two-factor-step two-factor-input-field">
            <label>OTP:</label>
            <input min={6} max={6} type='number'value={otpInput} onChange={(e)=>{setOtpInput(e.target.value)}} required/>
          </li>
          <li className="two-factor-step two-factor-input-field">
            <label>Current Master Password:</label>
            <input type='password' value={masterPasswordInput} onChange={(e)=>{setMasterPasswordInput(e.target.value)}} required/>
          </li>
        </ol>
        <ul>
          <li>
            <button type='button' onClick={()=>{handleVerifyTwoFactor()}}>Submit</button>
          </li>
          <li>
            <button type='button' onClick={()=>{navigate('/vault/settings')}}>Cancel</button>
          </li>
        </ul>
      </form>
    );
  };
};