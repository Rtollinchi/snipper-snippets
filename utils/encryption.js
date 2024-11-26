require("dotenv").config();
const crypto = require("crypto");

const key = Buffer.from(process.env.ENCRYPTION_KEY, "hex");

const algorithm = "aes-256-cbc";

function encrypt(plainText) {
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encryptedText = cipher.update(plainText, "utf8", "hex");
  encryptedText += cipher.final("hex");

  const result = iv.toString("hex") + ":" + encryptedText;

  return result;
}

function decrypt(input) {
  const parts = input.split(":");
  const iv = Buffer.from(parts[0], "hex");
  const encryptedText = parts[1];

  const decipher = crypto.createDecipheriv(algorithm, key, iv);

  let decryptedText = decipher.update(encryptedText, "hex", "utf8");
  decryptedText += decipher.final("utf8");

  return decryptedText;
}

// const plainText = "Hello, World!";
// const encryptedText = encrypt(plainText);
// console.log("Encrypted Text:", encryptedText);

// const decryptedText = decrypt(encryptedText);
// console.log("Decrypted Text:", decryptedText);

module.exports = { encrypt, decrypt };
