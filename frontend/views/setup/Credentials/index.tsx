import React from "react";
import { ComponentIsLoading } from "@gothicgeeks/design-system";
import { AuthLayout } from "../../../_layouts/guest";
import {
  useSetupCheck,
  useSetupCredentialsMutation,
} from "../../../hooks/setup/setup.store";
import { NAVIGATION_LINKS } from "../../../lib/routing/links";
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
      title="Setup DB crendentials"
      subTitle="Enter the crendentials of the data you want to manage"
    >
      <CredentialsSetupForm onSubmit={setupCredentialsMutation.mutateAsync} />
    </AuthLayout>
  );
}
