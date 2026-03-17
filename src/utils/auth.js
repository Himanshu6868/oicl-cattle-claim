export const AUTH_TOKEN_KEY = "oiclAuthToken";

const LEGACY_AUTH_TOKEN_KEYS = ["token", "accessToken", "authToken"];

export const getAuthToken = () => {
  const primaryToken = localStorage.getItem(AUTH_TOKEN_KEY);
  if (primaryToken) {
    return primaryToken;
  }

  for (const tokenKey of LEGACY_AUTH_TOKEN_KEYS) {
    const fallbackToken = localStorage.getItem(tokenKey);
    if (fallbackToken) {
      return fallbackToken;
    }
  }

  return null;
};

export const getAuthorizationHeaderValue = (token) => {
  if (!token) {
    return null;
  }

  const normalizedToken = token.trim();
  return /^Bearer\s+/i.test(normalizedToken)
    ? normalizedToken
    : `Bearer ${normalizedToken}`;
};

export const setAuthToken = (token) => {
  if (token) {
    const normalizedToken = token.trim();
    localStorage.setItem(AUTH_TOKEN_KEY, normalizedToken);
    localStorage.setItem("token", normalizedToken);
  }
};

export const clearAuthToken = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  LEGACY_AUTH_TOKEN_KEYS.forEach((tokenKey) => {
    localStorage.removeItem(tokenKey);
  });
};

export const isAuthenticated = () => Boolean(getAuthToken());
