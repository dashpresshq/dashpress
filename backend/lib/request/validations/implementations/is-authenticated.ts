import { authTokenService } from "backend/lib/auth-token/auth-token.service";
import { ForbiddenError } from "backend/lib/errors";
import { ValidationImplType } from "./types";

export const isAuthenticatedValidationImpl: ValidationImplType<void> = async (
  req,
  protectedRoute
) => {
  try {
    const reqHeaders = req.headers.authorization;
    if (!reqHeaders) {
      throw new ForbiddenError("No authorization token provided");
    }
    const authToken = reqHeaders.slice(7);
    if (!authToken) {
      throw new ForbiddenError("The authorization token provided is empty");
    }
    try {
      req.user = await authTokenService.verify(authToken);
    } catch (error) {
      throw new ForbiddenError("Invalid Token");
    }
  } catch (error) {
    if (protectedRoute) {
      throw error;
    }
  }
  if (req.user && !protectedRoute) {
    throw new ForbiddenError(
      "You are already authenticated, Please logout to continue with request"
    );
  }
};
