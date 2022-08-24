import React, { useEffect } from "react";
import { makePostRequest, ToastService } from "@hadmean/protozoa";
import { useMutation } from "react-query";
import { AuthLayout } from "frontend/_layouts/guest";
import { ISuccessfullAuthenticationResponse } from "shared/types";
import { useRouter } from "next/router";
import { NAVIGATION_LINKS } from "frontend/lib/routing";
import { useSetupCheck } from "frontend/hooks/setup/setup.store";
import { ComponentIsLoading } from "@hadmean/chromista";
import { ISignInForm } from "shared/form-schemas/auth/signin";
import {
  useAuthenticateUser,
  useUserAuthenticatedState,
} from "frontend/hooks/auth/useAuthenticateUser";
import { SignInForm } from "./Form";

function useSignInMutation() {
  const authenticateUser = useAuthenticateUser();
  return useMutation(
    async (values: ISignInForm) =>
      await makePostRequest(`/api/auth/signin`, values),
    {
      onSuccess: (data: ISuccessfullAuthenticationResponse, formData) => {
        authenticateUser(data.token, formData.rememberMe);
      },
      onError: (error: { message: string }) => {
        ToastService.error(error.message);
      },
    }
  );
}

const useGuestCheck = () => {
  const userAuthenticatedState = useUserAuthenticatedState();
  const router = useRouter();

  useEffect(() => {
    if (userAuthenticatedState === true) {
      router.replace(NAVIGATION_LINKS.DASHBOARD);
    }
  }, [typeof window]);

  return userAuthenticatedState === "loading";
};

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
