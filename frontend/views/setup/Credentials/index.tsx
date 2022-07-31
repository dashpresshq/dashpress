import React from "react";
import { AuthLayout } from "frontend/_layouts/guest";
import {
  useSetupCheck,
  useSetupCredentialsMutation,
} from "frontend/hooks/setup/setup.store";
import { ComponentIsLoading } from "@gothicgeeks/design-system";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { CredentialsSetupForm } from "./Form";

export function CredentialsSetup() {
  const setupCredentialsMutation = useSetupCredentialsMutation();

  const isChecking = useSetupCheck([
    {
      key: "hasDbCredentials",
      value: true,
      url: NAVIGATION_LINKS.SETUP.USER,
    },
  ]);

  if (isChecking) {
    return <ComponentIsLoading />;
  }

  return (
    <AuthLayout
      title="Setup your DB crendentials"
      subTitle="Enter the crendentials of the data you want to manage"
    >
      <CredentialsSetupForm onSubmit={setupCredentialsMutation.mutateAsync} />
    </AuthLayout>
  );
}
