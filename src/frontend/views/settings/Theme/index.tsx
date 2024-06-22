import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import { UserPermissions } from "shared/constants/user";
import {
  useAppConfiguration,
  useUpsertConfigurationMutation,
} from "frontend/hooks/configuration/configuration.store";
import { useAppConfigurationDomainMessages } from "frontend/hooks/configuration/configuration.constant";
import { AppConfigurationValueType } from "shared/configurations/constants";
import { msg } from "@lingui/macro";
import { SchemaForm } from "@/components/app/form/schema";
import { ViewStateMachine } from "@/components/app/view-state-machine";
import {
  FormSkeleton,
  FormSkeletonSchema,
} from "@/components/app/skeleton/form";
import { SectionBox } from "@/components/app/section-box";
import { BaseSettingsLayout } from "../_Base";
import { SETTINGS_VIEW_KEY } from "../constants";

type Settings = AppConfigurationValueType<"theme_color">;

export function ThemeSettings() {
  const themeColor = useAppConfiguration("theme_color");
  const domainMessages = useAppConfigurationDomainMessages("theme_color");

  const upsertConfigurationMutation =
    useUpsertConfigurationMutation("theme_color");

  useSetPageDetails({
    pageTitle: domainMessages.TEXT_LANG.TITLE,
    viewKey: SETTINGS_VIEW_KEY,
    permission: UserPermissions.CAN_CONFIGURE_APP,
  });

  return (
    <BaseSettingsLayout>
      <SectionBox title={domainMessages.TEXT_LANG.TITLE}>
        <ViewStateMachine
          loading={themeColor.isLoading}
          error={themeColor.error}
          loader={<FormSkeleton schema={[FormSkeletonSchema.Input]} />}
        >
          <SchemaForm<Settings>
            onSubmit={async ({ primary }) => {
              await upsertConfigurationMutation.mutateAsync({
                primary,
              });
            }}
            initialValues={{ ...themeColor.data }}
            systemIcon="Save"
            buttonText={domainMessages.FORM_LANG.UPSERT}
            fields={{
              primary: {
                label: msg`Color Scheme`,
                type: "color",
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
    </BaseSettingsLayout>
  );
}
