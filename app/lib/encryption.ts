import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.ENCRYPTION_SECRET || "default-secret-key-change-me";

export function encryptContent(content: string): string {
  return CryptoJS.AES.encrypt(content, SECRET_KEY).toString();
}

export function decryptContent(encryptedContent: string): string {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedContent, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    if (!decrypted) {
      throw new Error("Decryption failed - empty result");
    }
    return decrypted;
  } catch (error) {
    console.error("Decryption error:", error);
    return "[Unable to decrypt content]";
  }
}