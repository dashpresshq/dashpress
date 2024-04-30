import { AuthActions } from "frontend/hooks/auth/auth.actions";
import { REQUEST_ERROR_CODES } from "shared/constants/auth";
import { ApiRequestError } from "./_errors";

const pathWithBaseUrl = (path: string) => {
  if (path.startsWith("http")) {
    return path;
  }
  return (process.env.NEXT_PUBLIC_BASE_URL || "") + path;
};

const getRequestHeaders = () => {
  const authToken = AuthActions.getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }
  return headers;
};

const handleRequestError = async (response: Response, errorMessage: string) => {
  if (response.ok) {
    return;
  }
  const error = await response.json();

  if ([401, 400].includes(response.status)) {
    if (error.errorCode === REQUEST_ERROR_CODES.NOT_AUTHENTICATED) {
      AuthActions.signOut("makeRequest");
    }
    if (error.errorCode === REQUEST_ERROR_CODES.ALREADY_AUTHENTICATED) {
      AuthActions.signIn();
    }
  }
  throw new ApiRequestError(response.status, error.message || errorMessage);
};

export async function makeRawRequest(path: string, errorMessage?: string) {
  const response = await fetch(pathWithBaseUrl(path), {
    method: "GET",
    headers: {
      ...getRequestHeaders(),
    },
  });

  await handleRequestError(
    response,
    errorMessage ||
      "An error occurred downloading your data, Please try again later"
  );

  return response;
}

interface IActionRequestOptions {
  errorMessage?: string;
}

const makeActionRequest = async (
  method: "POST" | "PATCH" | "DELETE" | "PUT",
  path: string,
  data?: unknown,
  options: IActionRequestOptions = {}
) => {
  const response = await fetch(pathWithBaseUrl(path), {
    method,
    headers: {
      ...getRequestHeaders(),
    },
    body: data ? JSON.stringify(data) : undefined,
  });

  await handleRequestError(
    response,
    options.errorMessage || "An error occurred processing your request"
  );

  try {
    return await response.json();
  } catch {
    return response;
  }
};

export const ApiRequest = {
  GET: async (path: string, errorMessage?: string) => {
    const response = await makeRawRequest(path, errorMessage);
    return response.json();
  },
  POST: (path: string, data: unknown) => makeActionRequest("POST", path, data),
  PUT: (path: string, data: unknown) => makeActionRequest("PUT", path, data),
  PATCH: (path: string, data: unknown) =>
    makeActionRequest("PATCH", path, data),
  DELETE: (path: string) => makeActionRequest("DELETE", path),
  ACTION: makeActionRequest,
};

export const makeFileRequest = async (path: string, formData: FormData) => {
  const response = await fetch(pathWithBaseUrl(path), {
    method: "POST",
    headers: {
      ...getRequestHeaders(),
      "Content-Type": "multipart/form-data",
    },
    body: formData,
  });

  await handleRequestError(response, "An error occurred uploading your file");

  try {
    return await response.json();
  } catch {
    return response;
  }
};
