import { authTokenService } from "backend/lib/auth-token/auth-token.service";
import { ForbiddenError } from "backend/lib/errors";
import { REQUEST_ERROR_CODES } from "shared/constants";
import { ValidationImplType } from "./types";

const NO_AUTH_ERROR_CODE = REQUEST_ERROR_CODES.NOT_AUTHENTICATED;

export const isAuthenticatedValidationImpl: ValidationImplType<void> = async (
  req,
  protectedRoute: boolean
) => {
  try {
    const reqHeaders = req.headers.authorization;
    if (!reqHeaders) {
      throw new ForbiddenError(
        "No authorization token provided",
        NO_AUTH_ERROR_CODE
      );
    }
    const authToken = reqHeaders.slice(7);
    if (!authToken) {
      throw new ForbiddenError(
        "The authorization token provided is empty",
        NO_AUTH_ERROR_CODE
      );
    }
    try {
      req.user = await authTokenService.verify(authToken);
    } catch (error) {
      throw new ForbiddenError("Invalid Token", NO_AUTH_ERROR_CODE);
    }
  } catch (error) {
    if (protectedRoute) {
      throw error;
    }
  }
  if (req.user && !protectedRoute) {
    throw new ForbiddenError(
      "You are already authenticated, Please logout to continue with request",
      REQUEST_ERROR_CODES.ALREADY_AUTHENTICATED
    );
  }
};
