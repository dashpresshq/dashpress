import { NotFoundError } from "./errors";

const getCSRFToken = (): string => {
  return "TODO";
}

const getBestErrorMessage = (input: unknown) :string => {
  return "TODO";
}

export async function makeGetRequest(path: string, errorMessage?: string) {
  const response = await fetch(path, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new NotFoundError();
    }
    throw new Error(errorMessage || "An error occurred");
  }

  return response.json();
}

const sleep = (milliseconds: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

interface IActionRequestOptions {
  mockRequest?: unknown;
}

const makeActionRequest = async (
  method: "POST" | "PATCH" | "DELETE",
  path: string,
  data?: unknown,
  options: IActionRequestOptions = {}
) => {
  if (options.mockRequest !== undefined) {
    await sleep(500);
    return options.mockRequest;
  }
  const response = await fetch(path, {
    method,
    headers: {
      "Content-Type": "application/json",
      "x-csrf-token": await getCSRFToken(),
    },
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    throw new Error((await getBestErrorMessage(response)));
  }

  try {
    return await response.json();
  } catch {
    return response;
  }
};

export async function makePostRequest(
  path: string,
  data?: unknown,
  options?: IActionRequestOptions
) {
  return makeActionRequest("POST", path, data, options);
}

export async function makePatchRequest(
  path: string,
  data?: unknown,
  options?: IActionRequestOptions
) {
  return makeActionRequest("PATCH", path, data, options);
}

export async function makeDeleteRequest(
  path: string,
  data?: unknown,
  options?: IActionRequestOptions
) {
  return makeActionRequest("DELETE", path, data, options);
}
