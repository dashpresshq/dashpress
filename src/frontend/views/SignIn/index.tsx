import { msg } from "@lingui/macro";
import { useMutation } from "@tanstack/react-query";
import { AuthLayout } from "frontend/_layouts/guest";
import type { CustomNextPage } from "frontend/_layouts/types";
import { useAuthenticateUser } from "frontend/hooks/auth/useAuthenticateUser";
import { useGuestCheck } from "frontend/hooks/auth/useGuestCheck";
import { useSetupCheck } from "frontend/hooks/setup/setup.store";
import { ApiRequest } from "frontend/lib/data/makeRequest";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import type { ISignInForm } from "shared/form-schemas/auth/signin";
import { AUTH_SIGNIN_FORM_SCHEMA } from "shared/form-schemas/auth/signin";
import type { ISuccessfullAuthenticationResponse } from "shared/types/auth/portal";

import { SchemaForm } from "@/components/app/form/schema";
import { ComponentIsLoading } from "@/components/app/loading-component";
import { useToast } from "@/components/app/toast/use-toast";
import { fakeMessageDescriptor } from "@/translations/fake";

import { useHandleNoTokenAuthResponse } from "./portal";

function useSignInMutation() {
  const authenticateUser = useAuthenticateUser();
  const handleNoTokenAuthResponse = useHandleNoTokenAuthResponse();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (values: ISignInForm) =>
      await ApiRequest.POST(`/api/auth/signin`, values),
    onSuccess: (data: ISuccessfullAuthenticationResponse, formData) => {
      if (data.token) {
        authenticateUser(data.token, formData.rememberMe);
        return;
      }
      handleNoTokenAuthResponse(data, formData);
    },
    onError: (error: { message: string }) => {
      toast({
        variant: "red",
        description: fakeMessageDescriptor(error.message),
      });
    },
  });
}

// eslint-disable-next-line react/function-component-definition
export const SignIn: CustomNextPage = () => {
  const render = useGuestCheck();
  const signInMutation = useSignInMutation();

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
    return <ComponentIsLoading fullPage />;
  }

  return (
    <AuthLayout
      title={msg`Sign In`}
      subTitle={msg`Enter your credentials to continue`}
    >
      {process.env.NEXT_PUBLIC_IS_DEMO && (
        <div aria-label="Demo App Credentials">
          <p className="text-sm">
            Username is <b>root</b>
          </p>
          <p className="text-sm">
            Password is <b>password</b>
          </p>
        </div>
      )}
      <SchemaForm<ISignInForm>
        onSubmit={signInMutation.mutateAsync}
        initialValues={{ rememberMe: true }}
        buttonText={(isSubmitting) =>
          isSubmitting ? msg`Signing In` : msg`Sign In`
        }
        systemIcon="LogIn"
        fields={AUTH_SIGNIN_FORM_SCHEMA}
      />
    </AuthLayout>
  );
};
