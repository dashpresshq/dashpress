import {
  FormSkeleton,
  FormSkeletonSchema,
  SectionBox,
} from "@hadmean/chromista";
import { SLUG_LOADING_VALUE } from "@hadmean/protozoa";
import { useSetPageDetails } from "frontend/lib/routing";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { USER_PERMISSIONS } from "shared/constants/user";
import {
  useEntityDiction,
  useEntitySlug,
} from "frontend/hooks/entity/entity.config";
import { useUpsertConfigurationMutation } from "frontend/hooks/configuration/configuration.store";
import { LINK_TO_DOCS } from "frontend/views/constants";
import { BaseEntitySettingsLayout } from "../_Base";
import { EntityDictionForm } from "./Form";
import { ENTITY_CONFIGURATION_VIEW } from "../constants";
import { ENTITY_DICTION_SETTINGS_CRUD_CONFIG } from "./constant";

export function EntityDictionSettings() {
  const entity = useEntitySlug();
  const entityDiction = useEntityDiction();
  const upsertConfigurationMutation = useUpsertConfigurationMutation(
    "entity_diction",
    ENTITY_DICTION_SETTINGS_CRUD_CONFIG,
    entity
  );

  useSetPageDetails({
    pageTitle: ENTITY_DICTION_SETTINGS_CRUD_CONFIG.TEXT_LANG.TITLE,
    viewKey: ENTITY_CONFIGURATION_VIEW,
    permission: USER_PERMISSIONS.CAN_CONFIGURE_APP,
  });
  return (
    <BaseEntitySettingsLayout>
      <SectionBox
        title={ENTITY_DICTION_SETTINGS_CRUD_CONFIG.TEXT_LANG.TITLE}
        iconButtons={[
          {
            action: LINK_TO_DOCS("app-configuration/diction"),
            icon: "help",
            label: "Documentation",
          },
        ]}
      >
        <ViewStateMachine
          loading={entity === SLUG_LOADING_VALUE}
          error={false}
          loader={
            <FormSkeleton
              schema={[FormSkeletonSchema.Input, FormSkeletonSchema.Input]}
            />
          }
        >
          <EntityDictionForm
            onSubmit={async (values) => {
              await upsertConfigurationMutation.mutateAsync(
                values as unknown as Record<string, string>
              );
            }}
            initialValues={entityDiction}
          />
        </ViewStateMachine>
      </SectionBox>
    </BaseEntitySettingsLayout>
  );
}
