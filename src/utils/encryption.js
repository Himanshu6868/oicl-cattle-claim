const ENCRYPTION_KEY = import.meta.env.VITE_LOGIN_ENCRYPTION_KEY || "";

const encoder = new TextEncoder();

const toBase64 = (bytes) => {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary);
};

const getCryptoKey = async () => {
  if (!ENCRYPTION_KEY) {
    throw new Error("Missing VITE_LOGIN_ENCRYPTION_KEY for login payload encryption.");
  }

  const keyMaterial = await crypto.subtle.digest("SHA-256", encoder.encode(ENCRYPTION_KEY));

  return crypto.subtle.importKey(
    "raw",
    keyMaterial,
    { name: "AES-GCM" },
    false,
    ["encrypt"],
  );
};

const encryptWithWebCrypto = async (payload) => {
  const key = await getCryptoKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const plainText = encoder.encode(JSON.stringify(payload));
  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    plainText,
  );

  return `${toBase64(iv)}:${toBase64(new Uint8Array(encryptedBuffer))}`;
};

export const encryptPayload = async (payload) => {
  if (!ENCRYPTION_KEY) {
    throw new Error("Missing VITE_LOGIN_ENCRYPTION_KEY for login payload encryption.");
  }

  try {
    const importCryptoJs = new Function("moduleName", "return import(moduleName);");
    const CryptoJS = await importCryptoJs("crypto-js");
    return CryptoJS.default.AES.encrypt(JSON.stringify(payload), ENCRYPTION_KEY).toString();
  } catch (_error) {
    return encryptWithWebCrypto(payload);
  }
};
