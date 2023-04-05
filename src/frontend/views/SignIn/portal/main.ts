import noop from "lodash/noop";
import { ISignInForm } from "shared/form-schemas/auth/signin";
import { ISuccessfullAuthenticationResponse } from "shared/types/auth/portal";

export const useHandleNoTokenAuthResponse = () => {
  return (
    authResponse: ISuccessfullAuthenticationResponse,
    formData: ISignInForm
  ) => noop(authResponse, formData);
};
