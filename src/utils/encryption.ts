import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_LOGIN_ENCRYPTION_KEY || "";

export const encryptPayload = (payload: unknown): string => {
  if (!SECRET_KEY) {
    throw new Error("Missing VITE_LOGIN_ENCRYPTION_KEY");
  }

  const payloadString = JSON.stringify(payload);

  return CryptoJS.AES.encrypt(payloadString, SECRET_KEY).toString();
};
