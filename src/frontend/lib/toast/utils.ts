const DEFAULT_ERROR_MESSAGE =
  "Oops! Something Went Wrong. Please Check Your Network And Try Again";

export const getBestErrorMessage = (
  errorResponse:
    | string
    | { message?: string; response?: { data?: { message?: string } } },
  defaultErrorMessage?: string
): string => {
  if (typeof errorResponse === "string") {
    return errorResponse;
  }

  let bestErrorMessage = defaultErrorMessage || DEFAULT_ERROR_MESSAGE;

  if (errorResponse?.message) {
    bestErrorMessage = errorResponse.message;
  }

  if (errorResponse?.response?.data?.message) {
    bestErrorMessage = errorResponse.response.data.message;
  }

  if (bestErrorMessage === "Internal server error") {
    bestErrorMessage =
      "Oops! Something Went Wrong On Our End, Our Engineers Are Already Notified And Are Working On It. Please Check Back Shortly";
  }

  if (bestErrorMessage === "Network Error") {
    bestErrorMessage =
      "No Network Connection. Please Check Your Network And Try Again";
  }

  return bestErrorMessage;
};
