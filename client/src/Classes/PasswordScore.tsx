export class PasswordScore{
  entropy:number;
  color:string;
  strength:string;
  crackTime:string;

  constructor(passwordInput:string,charPoolLength:number){
    const passCombinations = BigInt(Math.pow(charPoolLength, passwordInput.length));
    //get entropy bits
    const passEntropyBits = Math.log2(Number(passCombinations));
    //set the password entropy to the hundreths place
    this.entropy = parseFloat(passEntropyBits.toFixed(2));
    //get strength
    if (passEntropyBits <= 39) {
      this.strength = 'Very Weak';
      this.color = 'grey';
      this.crackTime = 'Instantly'
    } else if (passEntropyBits >= 40 && passEntropyBits <= 59) {
      this.strength = 'Weak';
      this.color = 'red';
      this.crackTime = 'Minutes to Hours';
    } else if (passEntropyBits >= 60 && passEntropyBits <= 79) {
      this.strength = 'Moderate';
      this.color = 'orange';
      this.crackTime = 'Hours to Days';
    } else if (passEntropyBits >= 80 && passEntropyBits <= 99) {
      this.strength = 'Strong';
      this.color = 'yellow';
      this.crackTime = 'Days to Weeks';
    } else if (passEntropyBits >= 100 && passEntropyBits <= 119) {
      this.strength = 'Very Strong';
      this.color = 'green';
      this.crackTime = 'Months to Years';
    } else if (passEntropyBits >= 120) {
      this.strength = 'Extremely Strong';
      this.color = 'blue';
      this.crackTime = 'Millions of Years';
    }else{
      this.strength = 'Very Weak';
      this.color = 'grey';
      this.crackTime = 'Instantly'
    };
  };
};