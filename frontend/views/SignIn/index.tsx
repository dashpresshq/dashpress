import React from "react";
import {
  AuthService,
  makePostRequest,
  ToastService,
  useRouteParam,
} from "@gothicgeeks/shared";
import { useMutation } from "react-query";
import { AuthLayout } from "frontend/_layouts/guest";
import { ISuccessfullAuthenticationResponse } from "shared/types";
import { useRouter } from "next/router";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { SignInForm, ISignInForm } from "./Form";

function useSignInMutation() {
  const nextRoute = useRouteParam("next");
  const router = useRouter();
  return useMutation(
    async (values: ISignInForm) =>
      await makePostRequest(`/api/auth/signin`, values),
    {
      onSuccess: (data: ISuccessfullAuthenticationResponse, formData) => {
        AuthService.setAuthToken(data.token, formData.rememberMe);
        router.push(nextRoute || NAVIGATION_LINKS.DASHBOARD);
      },
      onError: (error: { message: string }) => {
        ToastService.error(error.message);
      },
    }
  );
}

export function SignIn() {
  const signInMutation = useSignInMutation();

  return (
    <AuthLayout
      title="Sign In Into Your Account"
      subTitle="Enter you crendentials to continue"
    >
      <SignInForm onSubmit={signInMutation.mutateAsync} />
    </AuthLayout>
  );
}
