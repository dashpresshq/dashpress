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
import { ISystemSettings } from "shared/configurations";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { MAKE_APP_CONFIGURATION_CRUD_CONFIG } from "frontend/hooks/configuration/configuration.constant";
import { SystemSettingsDocumentation } from "frontend/docs/system-settings";
import { DOCUMENTATION_LABEL } from "frontend/docs";
import { useState } from "react";
import { BaseSettingsLayout } from "../_Base";
import { SystemSettingsForm } from "./Form";
import { SETTINGS_VIEW_KEY } from "../constants";

const CRUD_CONFIG = MAKE_APP_CONFIGURATION_CRUD_CONFIG("system_settings");

const DOCS_TITLE = "System Settings";

export function SystemSettings() {
  const systemSettings =
    useAppConfiguration<ISystemSettings>("system_settings");

  const upsertConfigurationMutation =
    useUpsertConfigurationMutation("system_settings");

  const [isDocOpen, setIsDocOpen] = useState(false);

  useSetPageDetails({
    pageTitle: CRUD_CONFIG.TEXT_LANG.TITLE,
    viewKey: SETTINGS_VIEW_KEY,
    permission: USER_PERMISSIONS.CAN_CONFIGURE_APP,
  });

  return (
    <BaseSettingsLayout>
      <SectionBox
        title={CRUD_CONFIG.TEXT_LANG.TITLE}
        iconButtons={[
          {
            action: () => setIsDocOpen(true),
            icon: "help",
            label: DOCUMENTATION_LABEL.CONCEPT(DOCS_TITLE),
          },
        ]}
      >
        <ViewStateMachine
          loading={systemSettings.isLoading}
          error={systemSettings.error}
          loader={<FormSkeleton schema={[FormSkeletonSchema.Input]} />}
        >
          <SystemSettingsForm
            onSubmit={async (values) => {
              await upsertConfigurationMutation.mutateAsync(values);
            }}
            initialValues={systemSettings.data}
          />
        </ViewStateMachine>
      </SectionBox>
      <SystemSettingsDocumentation
        title={DOCS_TITLE}
        close={setIsDocOpen}
        isOpen={isDocOpen}
      />
    </BaseSettingsLayout>
  );
}
