import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.VITE_zpk;

// Generate the AES-128 key (16 bytes)
const generateKey = () => {
  return CryptoJS.enc.Utf8.parse(SECRET_KEY); // Convert key to WordArray
};

// Encrypt function
export const encryptData = (data) => {
  const key = generateKey();
  const encrypted = CryptoJS.AES.encrypt(data, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });

  return encrypted.toString();
};

// Decrypt function
export const decryptData = (encryptedData) => {
  const key = generateKey();
  const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });

  return decrypted.toString(CryptoJS.enc.Utf8); // Convert bytes to string
};
