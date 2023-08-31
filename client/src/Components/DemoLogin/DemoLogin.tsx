import React from 'react';
import './DemoLogin.css';

export default function DemoLogin(){
  const passwordStrengthFacts = [
    "Incorporating numbers and symbols into your password enhances its security.",
    "Avoid common words and phrases to prevent easily guessable passwords.",
    "Password length matters; aim for at least 12 characters for stronger security.",
    "Randomly generated passwords are generally stronger than personally created ones.",
    "Adding letters numbers, and special characters in unpredictable patterns improves password strength.",
    "Ensure you have enabled two-factor authentication for additional protection against unauthorized access."
  ];
  
  const getRandomFact = function() {
    return passwordStrengthFacts[Math.floor(Math.random() * passwordStrengthFacts.length)];
  };

  return(
    <section className='demo-login'>
      <p>
        Creating your secure demo environment...<br />
        This page will automatically refresh when complete.<br />
        <br />
        Tip: {getRandomFact()}
      </p>
    </section>
  )
};