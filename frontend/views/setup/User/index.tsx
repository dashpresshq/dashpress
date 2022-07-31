import React from "react";
import { AuthLayout } from "frontend/_layouts/guest";
import {
  useSetupCheck,
  useSetupUserMutation,
} from "frontend/hooks/setup/setup.store";
import { ComponentIsLoading } from "@gothicgeeks/design-system";
import { UserSetupForm } from "./Form";

export function UserSetup() {
  const setupUserMutation = useSetupUserMutation();

  const isChecking = useSetupCheck();

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
