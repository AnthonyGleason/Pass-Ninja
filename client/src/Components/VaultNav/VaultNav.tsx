import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import settingsGear from '../../Assets/settings-outline.svg';
import searchIcon from '../../Assets/search.svg';
import { VaultController } from '../../Classes/VaultController';
import './VaultNav.css';

export default function VaultNav({
  vaultController,
  setPassSnip,
}:{
  vaultController: VaultController,
  setPassSnip:Function,
}){
  const navigate = useNavigate();
  
  const [searchInput,setSearchInput] = useState<string>('');
  const [vaultHealthColor,setVaultHealthColor] = useState<string>('Blue');
  const [vaultHealthStatus,setVaultHealthStatus] = useState<string>('');
  const [vaultHealthPercent,setVaultHealthPercent] = useState<number>(0);

  //when the passwords array is updated (user performs crud operations on their vault the percent is regenerated)
  useEffect(()=>{
    setVaultHealthPercent(getVaultHealthPercent());
  },[vaultController.passwords]);

  //when the vault health percent is changed the color and vault status are obtained
  useEffect(()=>{
    setVaultHealthColor(getVaultHealthColor());
    setVaultHealthStatus(getVaultHealthStatus());
  },[vaultHealthPercent]);
  
  /*
    whenever the passwords list is updated (for example the user creates a new password) this useEffect makes sure that the
    new password is included in the search by performing a search on the updated passwords list.

    additionally this useEffect will perform searches automatically as the user types. (accomplished by adding the searchInput as a useEffect dependency)
  */
  useEffect(()=>{
    const filterPasswords = function(){
      return vaultController.passwords.filter((password:any) => {
        return password.nickName.toLowerCase().includes(searchInput);
      });
    };
    if (vaultController.passwords) setPassSnip(filterPasswords());
  },[vaultController.passwords,searchInput]);
  
  const getVaultHealthStatus = function():string{
    if (vaultHealthPercent>=80){
      return 'Excellent'
    }else if(vaultHealthPercent>=60){
      return 'Very Good'
    }else if(vaultHealthPercent>=40){
      return 'Moderate';
    }else if(vaultHealthPercent>=20){
      return 'Poor'
    }else if(vaultHealthPercent>=0 && vaultController.passwords.length!==0){ //there passwords in the vault but all are expired
      return 'Very Poor';
    }else{ //the vault is empty
      return 'N/A';
    }
  };

  const getVaultHealthColor = function():string{
    if (vaultHealthPercent>=80){
      return 'Blue'
    }else if(vaultHealthPercent>=60){
      return 'Yellow'
    }else if(vaultHealthPercent>=40){
      return 'Orange';
    }else if(vaultHealthPercent>=20){
      return 'Red'
    }else{
      return 'Grey';
    }
  };

  const getVaultHealthPercent = function(){
    const getExpireDays = (password:any): number => {
      if (password.expiresOn){
        // Get the time difference in milliseconds
        // basically expiration time - current time. converts the date string to a date then finds the difference in milliseconds
        const timeDifference = new Date(password.expiresOn).getTime() - new Date().getTime(); 
        const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
        return daysDifference;
      }else{
        return 0;
      }
    };

    let calculatedTotalPercent = 0;
    vaultController.passwords.forEach((password)=>{
      const percentage = (getExpireDays(password)/ 90) * 100; //calculate percentage health for a single password with 90 total days in a renewal cycle
      calculatedTotalPercent+=Math.round(percentage); // Round to the nearest whole number
    });
    const passwordsLength:number = vaultController.passwords.length || 1; //if the passwords.length is 0 we will see NaN because of the division by 0 errors in the next step
    const vaultHealthPercent = calculatedTotalPercent / (passwordsLength*100) * 100;
    return vaultHealthPercent;
  };

  const handleLogOut = async function(){
    await vaultController.logOutUser()
      .then(()=>{
        navigate('/');
      });
  };

  return(
    <nav className='vault-nav'>
      <ul>
        <li>
          <button type='button' onClick={()=>{navigate('/')}}>Home</button>
        </li>
        <li>
          <button type='button' onClick={()=>{navigate('/vault')}}>My Vault</button>
        </li>
        <li>
          <button type='button' onClick={()=>{navigate('/vault/settings')}}>
            <img src={settingsGear} alt='settings menu' />
          </button>
        </li>
        <li>
         <button type='button' onClick={()=>{handleLogOut()}}>Logout</button>
        </li>
      </ul>
      <form className='search-vault-bar'>
        <img src={searchIcon} alt='magnifying glass' />
        <input placeholder='' value={searchInput} onChange={(e)=>{setSearchInput(e.target.value)}} />
      </form>
      <p className='vault-health' style={{color: vaultHealthColor}}>
        Vault Health: {vaultHealthStatus} {vaultHealthPercent}%
      </p>
      <time>{new Date().toDateString()}</time>
    </nav>
  );
};