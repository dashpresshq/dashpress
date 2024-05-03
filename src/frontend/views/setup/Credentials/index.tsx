import {
  FormSkeleton,
  FormSkeletonSchema,
} from "frontend/design-system/components/Skeleton/Form";
import { useSetupCheck } from "frontend/hooks/setup/setup.store";
import { AuthLayout } from "frontend/_layouts/guest";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { CustomNextPage } from "frontend/_layouts/types";
import { msg } from "@lingui/macro";
import { CredentialsSetupForm } from "./Form";
import { useSetupCredentialsMutation } from "../setup.store";

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
      subTitle={msg`Enter the credentials of the data you want to manage`}
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
