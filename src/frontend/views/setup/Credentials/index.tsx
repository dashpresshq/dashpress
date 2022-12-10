import React from "react";
import { FormSkeleton, FormSkeletonSchema } from "@hadmean/chromista";
import { useSetupCheck } from "frontend/hooks/setup/setup.store";
import { AuthLayout } from "frontend/_layouts/guest";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { CredentialsSetupForm } from "./Form";
import { useSetupCredentialsMutation } from "../setup.store";

export function CredentialsSetup() {
  const setupCredentialsMutation = useSetupCredentialsMutation();

  const isChecking = useSetupCheck([
    {
      key: "hasDbCredentials",
      value: true,
      url: NAVIGATION_LINKS.SETUP.USER,
    },
  ]);

  return (
    <AuthLayout
      title="Setup DB credentials"
      subTitle="Enter the credentials of the data you want to manage"
    >
      <ViewStateMachine
        loading={isChecking}
        error={false}
        loader={
          <FormSkeleton
            schema={[
              FormSkeletonSchema.Input,
              FormSkeletonSchema.Input,
              FormSkeletonSchema.Input,
              FormSkeletonSchema.Input,
              FormSkeletonSchema.Input,
              FormSkeletonSchema.Input,
              FormSkeletonSchema.Input,
            ]}
          />
        }
      >
        <CredentialsSetupForm onSubmit={setupCredentialsMutation.mutateAsync} />
      </ViewStateMachine>
    </AuthLayout>
  );
}
