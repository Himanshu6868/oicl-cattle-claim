import CryptoJS from "crypto-js";

const ENCRYPTION_KEY = import.meta.env.VITE_LOGIN_ENCRYPTION_KEY;

export type EncryptablePayload = Record<string, unknown>;

export const encryptPayload = (payload: EncryptablePayload): string => {
  if (!ENCRYPTION_KEY) {
    throw new Error("Missing VITE_LOGIN_ENCRYPTION_KEY for login payload encryption.");
  }

  const jsonPayload = JSON.stringify(payload);
  const encrypted = CryptoJS.AES.encrypt(jsonPayload, ENCRYPTION_KEY).toString();

  return encrypted;
};
