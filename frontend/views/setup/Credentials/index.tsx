import React from "react";
import { AuthLayout } from "frontend/_layouts/guest";
import { useSetupCredentialsMutation } from "frontend/hooks/setup/setup.store";
import { CredentialsSetupForm } from "./Form";

export function CredentialsSetup() {
  const setupCredentialsMutation = useSetupCredentialsMutation();
  return (
    <AuthLayout
      title="Setup your DB crendentials"
      subTitle="Enter the crendentials of the data you want to manage"
    >
      <CredentialsSetupForm onSubmit={setupCredentialsMutation.mutateAsync} />
    </AuthLayout>
  );
}
