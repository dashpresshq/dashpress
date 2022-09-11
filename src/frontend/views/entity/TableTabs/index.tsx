import {
  FormSkeleton,
  FormSkeletonSchema,
  SectionBox,
} from "@hadmean/chromista";
import { SLUG_LOADING_VALUE } from "@hadmean/protozoa";
import { useSetPageDetails } from "frontend/lib/routing";
import { ViewStateMachine } from "frontend/lib/ViewStateMachine";
import { USER_PERMISSIONS, ITableTab } from "shared/types";
import { useEntitySlug } from "frontend/hooks/entity/entity.config";
import { LINK_TO_DOCS } from "frontend/views/constants";
import {
  useEntityConfiguration,
  useUpsertConfigurationMutation,
} from "frontend/hooks/configuration/configuration.store";
import { useEntityFields } from "frontend/hooks/entity/entity.store";
import { BaseEntitySettingsLayout } from "../_Base";
import { ENTITY_CONFIGURATION_VIEW } from "../constants";
import { EntityTableTabForm } from "./Form";

export function EntityTableTabsSettings() {
  const entity = useEntitySlug();

  const upsertEntityTableTabsMutation = useUpsertConfigurationMutation(
    "entity_table_tabs",
    entity
  );

  const entityTableTabs = useEntityConfiguration<ITableTab[]>(
    "entity_table_tabs",
    entity
  );

  const entityFields = useEntityFields(entity);

  useSetPageDetails({
    pageTitle: "Table Tabs Settings",
    viewKey: ENTITY_CONFIGURATION_VIEW,
    permission: USER_PERMISSIONS.CAN_CONFIGURE_APP,
  });

  const isLoading =
    entity === SLUG_LOADING_VALUE ||
    entityFields.isLoading ||
    entityTableTabs.isLoading;

  const error = entityFields.error || entityTableTabs.error;

  return (
    <BaseEntitySettingsLayout>
      <SectionBox
        title="Table Tabs Settings"
        iconButtons={[
          {
            action: LINK_TO_DOCS("app-configuration/table-tabs"),
            icon: "help",
            label: "Table Tabs Documentation TODO",
          },
        ]}
      >
        <ViewStateMachine
          loading={isLoading}
          error={error}
          loader={
            <FormSkeleton
              schema={[FormSkeletonSchema.Input, FormSkeletonSchema.Input]}
            />
          }
        >
          <EntityTableTabForm
            initialValues={entityTableTabs.data || []}
            onSubmit={async (data) => {
              await upsertEntityTableTabsMutation.mutateAsync(data);
            }}
            entityFields={entityFields.data || []}
          />
        </ViewStateMachine>
      </SectionBox>
    </BaseEntitySettingsLayout>
  );
}
