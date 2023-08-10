import React, {useEffect, useState} from 'react';
import xImg from '../../Assets/x-bold.svg';
import './Tooltip.css';

export default function Tooltip({
  term,
  desc
}:{
  term:string,
  desc:string
}){
  const [showTooltip,setShowTooltip] = useState<boolean>(false);
  if (!showTooltip){ //add is not an active tooltip
    return(
      <>
        <u onClick={()=>{setShowTooltip(true)}} className='tooltip-term'>{term}</u>
      </>
    )
  }else{
    return(
      <>
        <u onClick={()=>{setShowTooltip(false)}} className='tooltip-term'>{term}</u>
        <div className='tooltip' onClick={()=>{setShowTooltip(false)}}>
          <img src={xImg} alt='exit button' />
          <div>{desc}</div>
        </div>
      </>
    )
  }
}