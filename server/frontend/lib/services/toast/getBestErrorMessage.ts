import get from 'lodash/get';

const DEFAULT_ERROR_MESSAGE = 'Oops! Something Went Wrong. Please Check Your Network And Try Again';

export const getBestErrorMessage = (
  errorResponse: Record<string, unknown> | string | unknown,
  bestErrorMessage = DEFAULT_ERROR_MESSAGE,
): string => {
  if (typeof errorResponse === 'string') {
    return errorResponse;
  }

  if (get(errorResponse, ['message'], false)) {
    bestErrorMessage = get(errorResponse, ['message'], '');
  }

  if (get(errorResponse, ['response', 'data', 'message'], false)) {
    bestErrorMessage = get(errorResponse, ['response', 'data', 'message'], '');
  }

  if (bestErrorMessage === 'Internal server error') {
    // or the error response is 500
    bestErrorMessage =
      'Oops! Something Went Wrong On Our End, Our Engineers Are Already Notified And Are Working On It. Please Check Back Shortly';
  }

  if (bestErrorMessage === 'Network Error') {
    bestErrorMessage = 'No Network Connection. Please Check Your Network And Try Again';
  }

  return bestErrorMessage;
};
