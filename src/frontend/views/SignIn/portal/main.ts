import { noop } from "shared/lib/noop";
import type { ISignInForm } from "shared/form-schemas/auth/signin";
import type { ISuccessfullAuthenticationResponse } from "shared/types/auth/portal";

export const useHandleNoTokenAuthResponse = () => {
  return (
    authResponse: ISuccessfullAuthenticationResponse,
    formData: ISignInForm
  ) => noop(authResponse, formData);
};
