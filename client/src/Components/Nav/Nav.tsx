import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Nav(){
  const navigate = useNavigate();
  return(
    <div>
      {/* This is temporary, will be changed to useNaviagate in a proper nav component */}
      <h2 onClick={()=>{navigate('/')}}>PassNinja</h2>
    </div>
  )
};