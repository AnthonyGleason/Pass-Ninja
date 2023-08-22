import cryptoJS from 'crypto-js';

//encrypt the password using the masterPassword
export const encryptString = function(stringInput:string, masterPassword:string): string {
  return cryptoJS.AES.encrypt(stringInput, masterPassword).toString();
};

//decrypt the password will be used on client
export const decryptPassword = function(encryptedPassword: string, masterPassword: string): string {
  // inputs cannot be empty strings
  try{
    const decryptedBytes = cryptoJS.AES.decrypt(encryptedPassword, masterPassword);
    return decryptedBytes.toString(cryptoJS.enc.Utf8);
  }catch(e){
    console.log('Decryption Error has occured.', e);
    return '';
  }
};