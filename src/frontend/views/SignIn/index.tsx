import React, { useEffect } from "react";
import { useMutation } from "react-query";
import { AuthLayout } from "frontend/_layouts/guest";
import { ISuccessfullAuthenticationResponse } from "shared/types/auth/portal";
import { useSetupCheck } from "frontend/hooks/setup/setup.store";
import {
  AUTH_SIGNIN_FORM_SCHEMA,
  ISignInForm,
} from "shared/form-schemas/auth/signin";
import { useAuthenticateUser } from "frontend/hooks/auth/useAuthenticateUser";
import { makeActionRequest } from "frontend/lib/data/makeRequest";
import { ToastService } from "frontend/lib/toast";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { ComponentIsLoading } from "frontend/design-system/components/ComponentIsLoading";
import { Typo } from "frontend/design-system/primitives/Typo";
import { SchemaForm } from "frontend/components/SchemaForm";
import { AuthActions } from "frontend/hooks/auth/auth.actions";
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
  const [render, setRender] = React.useState(false);
  const signInMutation = useSignInMutation();
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (AuthActions.isAuthenticated()) {
        AuthActions.signIn();
      } else {
        setRender(true);
      }
    }
  }, [typeof window]);
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

  if (setupCheck || !render) {
    return <ComponentIsLoading />;
  }

  return (
    <AuthLayout title="Sign In" subTitle="Enter your credentials to continue">
      {process.env.NEXT_PUBLIC_IS_DEMO && (
        <div aria-label="Demo App Credentials">
          <Typo.XS>
            Username is <b>root</b>
          </Typo.XS>
          <Typo.XS>
            Password is <b>password</b>
          </Typo.XS>
        </div>
      )}
      <SchemaForm<ISignInForm>
        onSubmit={signInMutation.mutateAsync}
        initialValues={{ rememberMe: true }}
        buttonText={(isSubmitting) => (isSubmitting ? "Signing In" : "Sign In")}
        systemIcon="LogIn"
        fields={AUTH_SIGNIN_FORM_SCHEMA}
      />
    </AuthLayout>
  );
}
