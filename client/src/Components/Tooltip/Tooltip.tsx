import React, {useState} from 'react';
import './Tooltip.css';

export default function Tooltip({
  term,
  desc
}:{
  term:string,
  desc:string
}){
  const [isUserBrowsing,setIsUserBrowsing] = useState<boolean>(false);

  if (!isUserBrowsing){
    return(
      <>
        <u onClick={()=>{setIsUserBrowsing(true)}} className='tooltip-term'>{term}</u>
      </>
    )
  }else{
    return(
      <>
        <u className='tooltip-term'>{term}</u>
        <p className='tooltip' onClick={()=>{setIsUserBrowsing(false)}}>{desc}</p>
      </>
    )
  }
}