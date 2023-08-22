export class PasswordScore{
  entropyInBits:number;
  colorCode:string;
  strength:string;
  estCrackTime:string;

  constructor(
    passwordInput:string,
    charPoolLength:number
  ){
    const passCombinations:bigint = BigInt(Math.pow(charPoolLength, passwordInput.length));
    //get calculate entropy in bits
    const entropyInBits:number = Math.log2(Number(passCombinations));
    //set the password entropy to the hundreths place
    this.entropyInBits = parseFloat(entropyInBits.toFixed(2));
    //populate score properties
    this.strength = this.getStrength();
    this.colorCode = this.getColorCode();
    this.estCrackTime = this.getEstCrackTime();
  };

  getStrength = () => {
    switch (true) {
      case this.entropyInBits <= 39:
        return 'Very Weak';
      case this.entropyInBits <= 59:
        return 'Weak';
      case this.entropyInBits <= 79:
        return 'Moderate';
      case this.entropyInBits <= 99:
        return 'Strong';
      case this.entropyInBits <= 119:
        return 'Very Strong';
      case this.entropyInBits >= 120:
        return 'Extremely Strong';
      default:
        return '';
    };
  };
  
  getColorCode = () => {
    switch (true) {
      case this.entropyInBits <= 39:
        return 'grey';
      case this.entropyInBits <= 59:
        return 'red';
      case this.entropyInBits <= 79:
        return 'orange';
      case this.entropyInBits <= 99:
        return 'yellow';
      case this.entropyInBits <= 119:
        return 'green';
      case this.entropyInBits >= 120:
        return 'blue';
      default:
        return '';
    };
  };
  
  getEstCrackTime = () => {
    switch (true) {
      case this.entropyInBits <= 39:
        return 'Instantly';
      case this.entropyInBits <= 59:
        return 'Minutes to Hours';
      case this.entropyInBits <= 79:
        return 'Hours to Days';
      case this.entropyInBits <= 99:
        return 'Days to Weeks';
      case this.entropyInBits <= 119:
        return 'Months to Years';
      case this.entropyInBits >= 120:
        return 'Millions of Years';
      default:
        return '';
    };
  };  
};