import { SectionBox } from "frontend/design-system/components/Section/SectionBox";
import {
  FormSkeleton,
  FormSkeletonSchema,
} from "frontend/design-system/components/Skeleton/Form";
import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import { USER_PERMISSIONS } from "shared/constants/user";
import {
  useAppConfiguration,
  useUpsertConfigurationMutation,
} from "frontend/hooks/configuration/configuration.store";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { MAKE_APP_CONFIGURATION_CRUD_CONFIG } from "frontend/hooks/configuration/configuration.constant";
import { SystemSettingsDocumentation } from "frontend/docs/system-settings";
import { SchemaForm } from "frontend/components/SchemaForm";
import { IBaseSystemSettings } from "shared/configurations/system";
import { useDocumentationActionButton } from "frontend/docs/constants";
import { BaseSettingsLayout } from "../_Base";
import { SETTINGS_VIEW_KEY } from "../constants";

const CRUD_CONFIG = MAKE_APP_CONFIGURATION_CRUD_CONFIG("system_settings");

export function SystemSettings() {
  const systemSettings = useAppConfiguration("system_settings");

  const documentationActionButton =
    useDocumentationActionButton("System Settings");

  const upsertConfigurationMutation =
    useUpsertConfigurationMutation("system_settings");

  useSetPageDetails({
    pageTitle: CRUD_CONFIG.TEXT_LANG.TITLE,
    viewKey: SETTINGS_VIEW_KEY,
    permission: USER_PERMISSIONS.CAN_CONFIGURE_APP,
  });

  return (
    <BaseSettingsLayout>
      <SectionBox
        title={CRUD_CONFIG.TEXT_LANG.TITLE}
        actionButtons={[documentationActionButton]}
      >
        <ViewStateMachine
          loading={systemSettings.isLoading}
          error={systemSettings.error}
          loader={<FormSkeleton schema={[FormSkeletonSchema.Input]} />}
        >
          <SchemaForm<IBaseSystemSettings>
            onSubmit={upsertConfigurationMutation.mutateAsync}
            initialValues={systemSettings.data}
            systemIcon="Save"
            buttonText={CRUD_CONFIG.FORM_LANG.UPSERT}
            fields={{
              tokenValidityDurationInDays: {
                type: "number",
                validations: [
                  {
                    validationType: "required",
                  },
                ],
              },
            }}
          />
        </ViewStateMachine>
      </SectionBox>
      <SystemSettingsDocumentation />
    </BaseSettingsLayout>
  );
}
