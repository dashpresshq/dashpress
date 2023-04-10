import { ISuccessfullAuthenticationResponse } from "shared/types/auth/portal";
import { authTokenApiService } from "backend/lib/auth-token/auth-token.service";
import { usersPersistenceService } from "./shared";

export const generateAuthTokenForUsername = async (
  username: string
): Promise<ISuccessfullAuthenticationResponse> => {
  const user = await usersPersistenceService.getItemOrFail(username);

  delete user.password;

  return { token: await authTokenApiService.sign(user) };
};
