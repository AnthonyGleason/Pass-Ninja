import React from 'react';

export default function Nav(){
  return(
    <div>
      {/* This is temporary, will be changed to useNaviagate in a proper nav component */}
      <h2 onClick={()=>{window.location.href='/'}}>PassNinja</h2>
    </div>
  )
};