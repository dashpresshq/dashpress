import React from "react";
import { AuthLayout } from "frontend/_layouts/guest";
import {
  useSetupCheck,
  useSetupUserMutation,
} from "frontend/hooks/setup/setup.store";
import { ComponentIsLoading } from "@gothicgeeks/design-system";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { UserSetupForm } from "./Form";

export function UserSetup() {
  const setupUserMutation = useSetupUserMutation();

  const isChecking = useSetupCheck([
    {
      key: "hasDbCredentials",
      value: false,
      url: NAVIGATION_LINKS.SETUP.CREDENTIALS,
    },
    {
      key: "hasUsers",
      value: true,
      url: NAVIGATION_LINKS.AUTH_SIGNIN,
    },
  ]);

  if (isChecking) {
    return <ComponentIsLoading />;
  }

  return (
    <AuthLayout
      title="Create first creator account"
      subTitle="Enter your crendentials to continue"
    >
      <UserSetupForm onSubmit={setupUserMutation.mutateAsync} />
    </AuthLayout>
  );
}
