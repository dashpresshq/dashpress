import {
  FormSkeleton,
  FormSkeletonSchema,
  SectionBox,
  Spacer,
} from "@hadmean/chromista";
import { ViewStateMachine } from "frontend/lib/ViewStateMachine";
import { IntegrationsConfigurationGroup } from "shared/types/integrations";
import { LINK_TO_DOCS } from "frontend/views/constants";
import noop from "lodash/noop";
import {
  useIntegrationConfigurationDeletionMutation,
  useIntegrationConfigurationUpdationMutation,
  useIntegrationsConfigurationList,
} from "./configurations.store";
import { KeyValueForm } from "./Form";

export function BaseIntegrationsConfiguration({
  group,
}: {
  group: IntegrationsConfigurationGroup;
}) {
  const configurationList = useIntegrationsConfigurationList(group);
  const upsertConfigurationMutation =
    useIntegrationConfigurationUpdationMutation(group);
  const deleteConfigurationMutation =
    useIntegrationConfigurationDeletionMutation(group);
  noop(deleteConfigurationMutation);

  return (
    <>
      <SectionBox
        title={`Manage ${group}`}
        iconButtons={[
          {
            action: LINK_TO_DOCS(`integrations-configuration/${group}`),
            icon: "help",
            label: `${group} Configurations Documentation`,
          },
        ]}
      >
        <ViewStateMachine
          loading={configurationList.isLoading}
          error={configurationList.error}
          loader={
            <FormSkeleton
              schema={[
                FormSkeletonSchema.Input,
                FormSkeletonSchema.Input,
                FormSkeletonSchema.Input,
                FormSkeletonSchema.Input,
              ]}
            />
          }
        >
          <KeyValueForm
            initialValues={configurationList.data || {}}
            onSubmit={async (values: { key: string; value: string }) => {
              await upsertConfigurationMutation.mutateAsync(values);
            }}
            // onDelete={async (key: string) => {
            //   await deleteConfigurationMutation.mutateAsync({ key });
            // }}
          />
        </ViewStateMachine>
      </SectionBox>
      <Spacer />
    </>
  );
}
