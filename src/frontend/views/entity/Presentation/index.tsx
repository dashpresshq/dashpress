import {
  FormSkeleton,
  FormSkeletonSchema,
  SectionBox,
} from "@hadmean/chromista";
import { SLUG_LOADING_VALUE } from "@hadmean/protozoa";
import { useSetPageDetails } from "frontend/lib/routing";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { USER_PERMISSIONS } from "shared/constants/user";
import { useEntitySlug } from "frontend/hooks/entity/entity.config";
import {
  useEntityConfiguration,
  useUpsertConfigurationMutation,
} from "frontend/hooks/configuration/configuration.store";
import { LINK_TO_DOCS } from "frontend/views/constants";
import { MAKE_APP_CONFIGURATION_CRUD_CONFIG } from "frontend/hooks/configuration/configuration.constant";
import { IEntityPresentationScript } from "frontend/views/data/types";
import { BaseEntitySettingsLayout } from "../_Base";
import { PresentationScriptForm } from "./Form";
import { ENTITY_CONFIGURATION_VIEW } from "../constants";

const PRESENTATION_SCRIPT_CRUD_CONFIG = MAKE_APP_CONFIGURATION_CRUD_CONFIG(
  "entity_presentation_script"
);

export function EntityPresentationScriptSettings() {
  const entity = useEntitySlug();
  const entityPresentationScript =
    useEntityConfiguration<IEntityPresentationScript>(
      "entity_presentation_script",
      entity
    );
  const upsertConfigurationMutation = useUpsertConfigurationMutation(
    "entity_presentation_script",
    entity
  );

  useSetPageDetails({
    pageTitle: PRESENTATION_SCRIPT_CRUD_CONFIG.TEXT_LANG.TITLE,
    viewKey: ENTITY_CONFIGURATION_VIEW,
    permission: USER_PERMISSIONS.CAN_CONFIGURE_APP,
  });
  return (
    <BaseEntitySettingsLayout>
      <SectionBox
        title={PRESENTATION_SCRIPT_CRUD_CONFIG.TEXT_LANG.TITLE}
        iconButtons={[
          {
            action: LINK_TO_DOCS("app-configuration/presentation"),
            icon: "help",
            label: "Documentation",
          },
        ]}
      >
        <ViewStateMachine
          loading={
            entity === SLUG_LOADING_VALUE || entityPresentationScript.isLoading
          }
          error={entityPresentationScript.error}
          loader={<FormSkeleton schema={[FormSkeletonSchema.RichTextArea]} />}
        >
          <PresentationScriptForm
            onSubmit={async (values) => {
              await upsertConfigurationMutation.mutateAsync(
                values as unknown as Record<string, string>
              );
            }}
            initialValues={entityPresentationScript.data}
          />
        </ViewStateMachine>
      </SectionBox>
    </BaseEntitySettingsLayout>
  );
}
