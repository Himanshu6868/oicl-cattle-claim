import { encryptPayload } from "./encryption";

const LOGIN_API_URL =
  "https://y4132nnj76.execute-api.ap-south-1.amazonaws.com/pre-prod/api/v1/auth/login/password";

const getTokenFromResponse = (responseBody) => {
  if (!responseBody || typeof responseBody !== "object") {
    return null;
  }

  return (
    responseBody.token
    || responseBody.accessToken
    || responseBody?.data?.token
    || responseBody?.data?.accessToken
    || null
  );
};

export const loginWithUsernamePassword = async ({ username, password }) => {
  const payload = await encryptPayload({ userName: username, password });

  const response = await fetch(LOGIN_API_URL, {
    method: "POST",
    headers: {
      accept: "application/json, text/plain, */*",
      "content-type": "application/json",
      "x-language": "en",
      "x-source": "WEB",
    },
    body: JSON.stringify({ payload }),
  });

  let responseBody = null;
  try {
    responseBody = await response.json();
  } catch (_error) {
    responseBody = null;
  }

  if (!response.ok) {
    const errorMessage = responseBody?.message || "Login failed. Please check your credentials.";
    throw new Error(errorMessage);
  }

  return {
    token: getTokenFromResponse(responseBody),
    raw: responseBody,
  };
};
