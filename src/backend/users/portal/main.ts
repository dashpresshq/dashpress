import type { ISuccessfullAuthenticationResponse } from "shared/types/auth/portal";

export const getPortalAuthenticationResponse = async (
  username: string,
  getAuthToken: (
    username: string
  ) => Promise<ISuccessfullAuthenticationResponse>
) => {
  return await getAuthToken(username);
};
