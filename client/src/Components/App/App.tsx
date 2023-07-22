import React from 'react';
import ninjaImg from '../../Assets/285699.png'
import './App.css';

function App() {
  return (
    <div className="App">
      Welcome to PassNinja<br/>
      <img src={ninjaImg} />
      <div>
        <a href='/login'>Login</a><br />
        <a href='/register'>Register</a>
      </div>
    </div>
  );
};

export default App;
