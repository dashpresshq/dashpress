import {
  FormSkeleton,
  FormSkeletonSchema,
  SectionBox,
} from "@hadmean/chromista";
import { SLUG_LOADING_VALUE } from "frontend/lib/routing/constants";
import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { ITableTab } from "shared/types/data";
import { useEntitySlug } from "frontend/hooks/entity/entity.config";
import {
  useEntityConfiguration,
  useUpsertConfigurationMutation,
} from "frontend/hooks/configuration/configuration.store";
import { USER_PERMISSIONS } from "shared/constants/user";
import { useTableColumns } from "frontend/views/data/Table/useTableColumns";
import { MAKE_APP_CONFIGURATION_CRUD_CONFIG } from "frontend/hooks/configuration/configuration.constant";
import { useState } from "react";
import { DOCUMENTATION_LABEL } from "frontend/docs";
import { ViewsDocumentation } from "frontend/docs/views";
import { BaseEntitySettingsLayout } from "../_Base";
import { ENTITY_CONFIGURATION_VIEW } from "../constants";
import { EntityTableTabForm } from "./Form";

const CRUD_CONFIG = MAKE_APP_CONFIGURATION_CRUD_CONFIG("entity_views");

const DOCS_TITLE = "Views";

export function EntityViewsSettings() {
  const entity = useEntitySlug();
  const [isDocOpen, setIsDocOpen] = useState(false);

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
    pageTitle: CRUD_CONFIG.TEXT_LANG.TITLE,
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
              initialValues={entityViews.data}
              onSubmit={async (data) => {
                await upsertEntityViewsMutation.mutateAsync(data);
              }}
              tableColumns={tableColumns.data || []}
            />
          )}
        </ViewStateMachine>
      </SectionBox>
      <ViewsDocumentation
        title={DOCS_TITLE}
        close={setIsDocOpen}
        isOpen={isDocOpen}
      />
    </BaseEntitySettingsLayout>
  );
}
