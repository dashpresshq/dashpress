import React from "react";
import { AuthLayout } from "frontend/_layouts/guest";
import { useSetupCheck } from "frontend/hooks/setup/setup.store";
import { ComponentIsLoading } from "@hadmean/chromista";
import { NAVIGATION_LINKS } from "frontend/lib/routing";
import { UserSetupForm } from "./Form";
import { useSetupUserMutation } from "../setup.store";

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
      title="Admin Account Setup"
      subTitle="Create first creator account"
    >
      <UserSetupForm onSubmit={setupUserMutation.mutateAsync} />
    </AuthLayout>
  );
}
