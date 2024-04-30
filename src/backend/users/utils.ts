import { ISuccessfullAuthenticationResponse } from "shared/types/auth/portal";
import { authTokenApiService } from "backend/lib/auth-token/auth-token.service";
import { usersApiService } from "./users.service";

export const generateAuthTokenForUsername = async (
  username: string
): Promise<ISuccessfullAuthenticationResponse> => {
  return {
    token: await authTokenApiService.sign(
      await usersApiService.getAccountProfile(username)
    ),
  };
};
