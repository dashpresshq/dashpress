import { authTokenApiService } from "backend/lib/auth-token/auth-token.service";
import { UnauthorizedError } from "backend/lib/errors";
import { REQUEST_ERROR_CODES } from "shared/constants/auth";
import { ValidationImplType } from "./types";

const NO_AUTH_ERROR_CODE = REQUEST_ERROR_CODES.NOT_AUTHENTICATED;

export const isAuthenticatedValidationImpl: ValidationImplType<void> = async (
  req,
  protectedRoute: boolean
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedError(
        "No authorization token provided",
        NO_AUTH_ERROR_CODE
      );
    }
    const authToken = authHeader.slice(7);
    if (!authToken) {
      throw new UnauthorizedError(
        "The authorization token provided is empty",
        NO_AUTH_ERROR_CODE
      );
    }
    try {
      req.user = await authTokenApiService.verify(authToken);
    } catch (error) {
      throw new UnauthorizedError("Invalid Token", NO_AUTH_ERROR_CODE);
    }
  } catch (error) {
    if (protectedRoute) {
      throw error;
    }
  }
  if (req.user && !protectedRoute) {
    throw new UnauthorizedError(
      "You are already authenticated, Please logout to continue with request",
      REQUEST_ERROR_CODES.ALREADY_AUTHENTICATED
    );
  }
};
