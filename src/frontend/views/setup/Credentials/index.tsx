import { msg } from "@lingui/macro";
import { AuthLayout } from "frontend/_layouts/guest";
import type { CustomNextPage } from "frontend/_layouts/types";
import { useSetupCheck } from "frontend/hooks/setup/setup.store";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";

import {
  FormSkeleton,
  FormSkeletonSchema,
} from "@/components/app/skeleton/form";
import { ViewStateMachine } from "@/components/app/view-state-machine";

import { useSetupCredentialsMutation } from "../setup.store";
import { CredentialsSetupForm } from "./Form";

// eslint-disable-next-line react/function-component-definition
export const CredentialsSetup: CustomNextPage = () => {
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
      title={msg`Setup DB credentials`}
      subTitle={msg`Enter your database credentials to continue`}
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
};
