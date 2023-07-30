import cryptoJS from 'crypto-js';

//encrypt the password using the masterPassword
export const encryptPassword = function(passwordInput:string, masterPassword:string): string {
  return cryptoJS.AES.encrypt(passwordInput, masterPassword).toString();
};

//decrypt the password will be used on client
export const decryptPassword = function(encryptedPassword: string, masterPassword: string): string {
  const decryptedBytes = cryptoJS.AES.decrypt(encryptedPassword, masterPassword);
  return decryptedBytes.toString(cryptoJS.enc.Utf8);
};