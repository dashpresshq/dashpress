import {
  FormSkeleton,
  FormSkeletonSchema,
  SectionBox,
} from "@hadmean/chromista";
import { SLUG_LOADING_VALUE } from "@hadmean/protozoa";
import { useSetPageDetails } from "frontend/lib/routing";
import { ViewStateMachine } from "frontend/lib/ViewStateMachine";
import { USER_PERMISSIONS } from "shared/types";
import { useEntitySlug } from "frontend/hooks/entity/entity.config";
import { LINK_TO_DOCS } from "frontend/views/constants";
import {
  useEntityConfiguration,
  useUpsertConfigurationMutation,
} from "frontend/hooks/configuration/configuration.store";
import { BaseEntitySettingsLayout } from "../_Base";
import { ENTITY_CONFIGURATION_VIEW } from "../constants";
import { EntityTableTabForm, ITableTab } from "./Form";

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

  useSetPageDetails({
    pageTitle: "Table Tabs Settings",
    viewKey: ENTITY_CONFIGURATION_VIEW,
    permission: USER_PERMISSIONS.CAN_CONFIGURE_APP,
  });

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
          loading={entity === SLUG_LOADING_VALUE}
          error={false}
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
          />
        </ViewStateMachine>
      </SectionBox>
    </BaseEntitySettingsLayout>
  );
}
