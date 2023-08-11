import React, {useState} from 'react';
import xImg from '../../Assets/x-bold.svg';
import './Tooltip.css';

export default function Tooltip({
  term,
  desc,
  activeTooltipTerm,
  setActiveTooltipTerm
}:{
  term:string,
  desc:string,
  activeTooltipTerm:string,
  setActiveTooltipTerm:Function
}){
  if (activeTooltipTerm!==term){
    return(
      <>
        <u onClick={()=>{setActiveTooltipTerm(term)}} className='tooltip-term'>{term}</u>
      </>
    )
  }else{
    return(
      <>
        <u onClick={()=>{setActiveTooltipTerm('')}} className='tooltip-term'>{term}</u>
        {/* the tooltip class has a reasonable z-index so it appears above other elements as an alert */}
        <div className='tooltip' onClick={()=>{setActiveTooltipTerm(false)}}>
          <img src={xImg} alt='exit button' />
          <div>{desc}</div>
        </div>
      </>
    );
  };
};