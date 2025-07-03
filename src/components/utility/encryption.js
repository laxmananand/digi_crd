import CryptoJS from "crypto-js";

const PIN_LENGTH = 4;
const ZERO_PAD = "0000000000000000";

export function setPINblock(ZPKkey, PIN, pan) {
  let PanWithZero = ZERO_PAD + pan;
  pan = PanWithZero.substring(PanWithZero.length - 16);
  console.log("Extracted PAN:", pan);

  let tdes = new TripleDES(ZPKkey, PIN_LENGTH);
  let encrypted = tdes.encrypt(pan, PIN);
  console.log("PIN Block :", encrypted);
  return encrypted;
}

class TripleDES {
  constructor(key, pinLength) {
    this.key = this.expandTripleDESKey(key); // Corrected Key Expansion
    this.pinLength = pinLength;
  }

  encrypt(pan, pinClear) {
    let pinEncoded = this.encodePinBlockAsHex(pan, pinClear);
    let key = this.key;
    let encrypted = CryptoJS.TripleDES.encrypt(
      CryptoJS.enc.Hex.parse(pinEncoded),
      key,
      {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.NoPadding,
      }
    );
    return encrypted.ciphertext.toString(CryptoJS.enc.Hex).toUpperCase();
  }

  encodePinBlockAsHex(pan, pin) {
    let Fs = "FFFFFFFFFFFFFFFF";
    let prefix = pin.length.toString().padStart(2, "0");
    let paddingPIN =
      prefix + pin + Fs.substring(prefix.length + pin.length, Fs.length);
    let pinBlock = this.xorBytes(this.h2b(pan), this.h2b(paddingPIN));
    return this.b2h(pinBlock);
  }

  xorBytes(a, b) {
    if (a.length !== b.length) {
      throw new Error("Byte arrays must be of equal length");
    }
    let result = [];
    for (let i = 0; i < a.length; i++) {
      result.push(a[i] ^ b[i]);
    }
    return result;
  }

  h2b(hex) {
    if ((hex.length & 0x01) === 0x01)
      throw new Error("Hex string must have even length");
    let bytes = [];
    for (let idx = 0; idx < hex.length; idx += 2) {
      let hi = parseInt(hex.charAt(idx), 16);
      let lo = parseInt(hex.charAt(idx + 1), 16);
      if (isNaN(hi) || isNaN(lo)) throw new Error("Invalid hex character");
      bytes.push((hi << 4) | lo);
    }
    return bytes;
  }

  b2h(bytes) {
    return bytes
      .map((byte) => byte.toString(16).padStart(2, "0").toUpperCase())
      .join("");
  }

  expandTripleDESKey(keyHex) {
    let keyBytes = CryptoJS.enc.Hex.parse(keyHex);

    if (keyHex.length === 32) {
      // If key is 16 bytes (128-bit)
      keyHex += keyHex.substring(0, 16); // Duplicate first 8 bytes
    } else if (keyHex.length !== 48) {
      // Must be 24 bytes (192-bit)
      throw new Error("Invalid 3DES key length. Must be 16 or 24 bytes.");
    }

    return CryptoJS.enc.Hex.parse(keyHex);
  }
}

// Example usage:
// let encryptedPinBlock = setPINblock(
//   "07B536AEE1A3FC08F18A223B09E426F1", // 16-byte ZPK key (fixed to 24 bytes)
//   "9632",
//   "9719382435443"
// );
// console.log("Final Encrypted PIN Block:", encryptedPinBlock);
