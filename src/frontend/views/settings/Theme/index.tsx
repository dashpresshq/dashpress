import {
  FormSkeleton,
  FormSkeletonSchema,
  SectionBox,
} from "@hadmean/chromista";
import { useSetPageDetails } from "frontend/lib/routing";
import { USER_PERMISSIONS } from "shared/types/user";
import {
  useAppConfiguration,
  useUpsertConfigurationMutation,
} from "frontend/hooks/configuration/configuration.store";
import { ViewStateMachine } from "frontend/lib/ViewStateMachine";
import { BaseSettingsLayout } from "../_Base";
import { ThemeSettingsForm } from "./Form";
import { SETTINGS_VIEW_KEY } from "../constants";

export function ThemeSettings() {
  const themeColor = useAppConfiguration<{ primary: string }>("theme_color");

  const upsertConfigurationMutation =
    useUpsertConfigurationMutation("theme_color");

  useSetPageDetails({
    pageTitle: "Theme Settings",
    viewKey: SETTINGS_VIEW_KEY,
    permission: USER_PERMISSIONS.CAN_CONFIGURE_APP,
  });

  return (
    <BaseSettingsLayout>
      <SectionBox title="Theme Settings">
        <ViewStateMachine
          loading={themeColor.isLoading}
          error={themeColor.error}
          loader={<FormSkeleton schema={[FormSkeletonSchema.Input]} />}
        >
          <ThemeSettingsForm
            onSubmit={async (values) => {
              await upsertConfigurationMutation.mutateAsync(values);
            }}
            initialValues={themeColor.data}
          />
        </ViewStateMachine>
      </SectionBox>
    </BaseSettingsLayout>
  );
}
