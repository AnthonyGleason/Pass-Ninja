import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import settingsGear from '../../Assets/settings-outline.svg';
import searchIcon from '../../Assets/search.svg';

export default function VaultNav({
  passwords,
  setPassSnip
}:{
  passwords:any[],
  setPassSnip:Function,
}){
  const [searchInput,setSearchInput] = useState<string>('');
  const navigate = useNavigate();
  /*
    whenever the passwords list is updated (for example the user creates a new password) this useEffect makes sure that the
    new password is included in the search by performing a search on the updated passwords list.

    additionally this useEffect will perform searches automatically as the user types. (accomplished by adding the searchInput as a useEffect dependency)
  */
  useEffect(()=>{
    const filterPasswords = function(){
      return passwords.filter((password:any) => {
        return password.nickName.toLowerCase().includes(searchInput);
      });
    };
    if (passwords) setPassSnip(filterPasswords());
  },[passwords,searchInput]);
  
  return(
    <div className='vault-nav'>
      <div className='vault-buttons'>
        <p onClick={()=>{navigate('/')}}>Home</p>
        <p onClick={()=>{navigate('/vault')}}>My Vault</p>
        <p>{new Date().toDateString()}</p>
        <img src={settingsGear} alt='settings menu' onClick={()=>{navigate('/vault/settings')}} />
      </div>
      <div className='search-vault-bar'>
        <img src={searchIcon} alt='magnifying glass' />
        <input placeholder='' value={searchInput} onChange={(e)=>{setSearchInput(e.target.value)}} />
      </div>
    </div>
  )
}