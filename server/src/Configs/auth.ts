export const loginTokenExpireTime:string ='1H'

export const demoPass:{
  userName:string,
  siteUrl:string,
  nickName:string,
  notes:string,
  minLength:number,
  maxLength:number,
  useSpecialChars:boolean,
  useUpperCases:boolean,
  useNumbers:boolean
} = {
  userName: 'user',
  siteUrl: 'https://www.example.com',
  nickName: 'Hello World!',
  notes: 'Thank you for trying PassNinja!',
  minLength: 35,
  maxLength: 50,
  useSpecialChars: true,
  useUpperCases: true,
  useNumbers: true
}

export const speakeasySecretLength:number = 45;
export const qrCodeErrorCorrectionStrength = 'M'; //possible values; 'L' || 'M' || 'H'. Sets the error correcting strength incase qr code is damage