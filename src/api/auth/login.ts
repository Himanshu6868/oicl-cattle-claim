import { encryptPayload } from "../../utils/encryption";

type LoginWithUsernamePasswordParams = {
  username: string;
  password: string;
};

type LoginApiResponse = {
  token?: string;
  accessToken?: string;
  data?: {
    token?: string;
    accessToken?: string;
  };
  message?: string;
  [key: string]: unknown;
};

type LoginResponse = {
  token: string | null;
  raw: LoginApiResponse | null;
};

const LOGIN_API_URL =
  "https://y4132nnj76.execute-api.ap-south-1.amazonaws.com/pre-prod/api/v1/auth/login/password";

const getTokenFromResponse = (responseBody: LoginApiResponse | null): string | null => {
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

export const loginWithUsernamePassword = async ({
  username,
  password,
}: LoginWithUsernamePasswordParams): Promise<LoginResponse> => {
  try {
    const encryptedPayload = encryptPayload({
      userName: username,
      password,
    });

    const response = await fetch(LOGIN_API_URL, {
      method: "POST",
      headers: {
        accept: "application/json, text/plain, */*",
        "content-type": "application/json",
        "x-language": "en",
        "x-source": "WEB",
      },
      body: JSON.stringify({
        payload: encryptedPayload,
      }),
    });

    let responseBody: LoginApiResponse | null = null;
    try {
      responseBody = (await response.json()) as LoginApiResponse;
    } catch (_error) {
      responseBody = null;
    }

    if (!response.ok) {
      throw new Error(responseBody?.message || "Login failed. Please check your credentials.");
    }

    return {
      token: getTokenFromResponse(responseBody),
      raw: responseBody,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Unexpected error occurred while logging in.");
  }
};
