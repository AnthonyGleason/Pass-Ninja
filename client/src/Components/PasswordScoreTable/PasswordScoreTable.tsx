import React from 'react';

export default function PasswordScoreTable(){
  return(
    <table>
      <thead>
        <tr>
          <th>How Are Passwords Rated?</th>
        </tr>
        <tr>
          <th>Bits</th>
          <th>Strength</th>
          <th>Time to Crack</th>
        </tr>
      </thead>
      <tbody>
        <tr style={{backgroundColor: 'grey'}}>
          <td>0-39</td>
          <td>Very Weak</td>
          <td>Instantly</td>
        </tr>
        <tr style={{backgroundColor: 'red'}}>
          <td>40-59</td>
          <td>Weak</td>
          <td>Minutes to Hours</td>
        </tr>
        <tr style={{backgroundColor: 'orange'}}>
          <td>60-79</td>
          <td>Moderate</td>
          <td>Hours to Days</td>
        </tr>
        <tr style={{backgroundColor: 'yellow'}}>
          <td>80-99</td>
          <td>Strong</td>
          <td>Days to Weeks</td>
        </tr>
        <tr style={{backgroundColor: 'green'}}>
          <td>100-119</td>
          <td>Very Strong</td>
          <td>Months to Years</td>
        </tr>
        <tr style={{backgroundColor: 'blue'}}>
          <td>120+</td>
          <td>Extremely Strong</td>
          <td>Millions of Years</td>
        </tr>
      </tbody>
    </table>
  );
};