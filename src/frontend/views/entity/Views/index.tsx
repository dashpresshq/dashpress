import {
  FormSkeleton,
  FormSkeletonSchema,
  SectionBox,
} from "@hadmean/chromista";
import { SLUG_LOADING_VALUE } from "@hadmean/protozoa";
import { useSetPageDetails } from "frontend/lib/routing";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { ITableTab } from "shared/types/data";
import { useEntitySlug } from "frontend/hooks/entity/entity.config";
import { LINK_TO_DOCS } from "frontend/views/constants";
import {
  useEntityConfiguration,
  useUpsertConfigurationMutation,
} from "frontend/hooks/configuration/configuration.store";
import { USER_PERMISSIONS } from "shared/constants/user";
import { useTableColumns } from "frontend/views/data/Table/useTableColumns";
import { BaseEntitySettingsLayout } from "../_Base";
import { ENTITY_CONFIGURATION_VIEW } from "../constants";
import { EntityTableTabForm } from "./Form";

export function EntityViewsSettings() {
  const entity = useEntitySlug();

  const upsertEntityViewsMutation = useUpsertConfigurationMutation(
    "entity_views",
    entity
  );

  const entityViews = useEntityConfiguration<ITableTab[]>(
    "entity_views",
    entity
  );

  const tableColumns = useTableColumns(entity);

  useSetPageDetails({
    pageTitle: "Views Settings",
    viewKey: ENTITY_CONFIGURATION_VIEW,
    permission: USER_PERMISSIONS.CAN_CONFIGURE_APP,
  });

  const isLoading =
    tableColumns.isLoading ||
    entity === SLUG_LOADING_VALUE ||
    entityViews.isLoading;

  const error = entityViews.error || tableColumns.error;

  return (
    <BaseEntitySettingsLayout>
      <SectionBox
        title="Views Settings"
        iconButtons={[
          {
            action: LINK_TO_DOCS("app-configuration/views"),
            icon: "help",
            label: "Views Documentation",
          },
        ]}
      >
        <ViewStateMachine
          loading={isLoading}
          error={error}
          loader={
            <FormSkeleton
              schema={[FormSkeletonSchema.Input, FormSkeletonSchema.Textarea]}
            />
          }
        >
          {!isLoading && (
            <EntityTableTabForm
              initialValues={entityViews.data || []}
              onSubmit={async (data) => {
                await upsertEntityViewsMutation.mutateAsync(data);
              }}
              tableColumns={tableColumns.data || []}
            />
          )}
        </ViewStateMachine>
      </SectionBox>
    </BaseEntitySettingsLayout>
  );
}
