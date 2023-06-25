import React from "react";
import { useMutation } from "react-query";
import { AuthLayout } from "frontend/_layouts/guest";
import { ISuccessfullAuthenticationResponse } from "shared/types/auth/portal";
import { useSetupCheck } from "frontend/hooks/setup/setup.store";
import { ComponentIsLoading } from "@hadmean/chromista";
import { ISignInForm } from "shared/form-schemas/auth/signin";
import { useAuthenticateUser } from "frontend/hooks/auth/useAuthenticateUser";
import { useGuestCheck } from "frontend/hooks/auth/useGuestCheck";
import { makeActionRequest } from "frontend/lib/data/makeRequest";
import { ToastService } from "frontend/lib/toast";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { SignInForm } from "./Form";
import { useHandleNoTokenAuthResponse } from "./portal";

function useSignInMutation() {
  const authenticateUser = useAuthenticateUser();
  const handleNoTokenAuthResponse = useHandleNoTokenAuthResponse();
  return useMutation(
    async (values: ISignInForm) =>
      await makeActionRequest("POST", `/api/auth/signin`, values),
    {
      onSuccess: (data: ISuccessfullAuthenticationResponse, formData) => {
        if (data.token) {
          authenticateUser(data.token, formData.rememberMe);
          return;
        }
        handleNoTokenAuthResponse(data, formData);
      },
      onError: (error: { message: string }) => {
        ToastService.error(error.message);
      },
    }
  );
}

export function SignIn() {
  const signInMutation = useSignInMutation();
  const guestCheck = useGuestCheck();
  const setupCheck = useSetupCheck([
    {
      key: "hasDbCredentials",
      value: false,
      url: NAVIGATION_LINKS.SETUP.CREDENTIALS,
    },
    {
      key: "hasUsers",
      value: false,
      url: NAVIGATION_LINKS.SETUP.USER,
    },
  ]);

  if (setupCheck || guestCheck) {
    return <ComponentIsLoading />;
  }

  return (
    <AuthLayout title="Sign In" subTitle="Enter your credentials to continue">
      <SignInForm onSubmit={signInMutation.mutateAsync} />
    </AuthLayout>
  );
}
