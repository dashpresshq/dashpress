import { ErrorAlert, Tabs, SectionBox } from "@gothicgeeks/design-system";
import {
  IEntityCrudSettings,
  useEntityCrudSettings,
  useEntitySlug,
  useSelectedEntityColumns,
} from "../../../../hooks/entity/entity.config";
import noop from "lodash/noop";
import { NAVIGATION_LINKS } from "../../../../lib/routing/links";
import { BaseEntitySettingsLayout } from "../_Base";
import { useUpsertConfigurationMutation } from "../../../../hooks/configuration/configration.store";
import { useEntityScalarFields } from "../../../../hooks/entity/entity.store";
import { SelectionTab } from "./SelectionTab";

import { useEffect, useState } from "react";

const LABELS = [
  // "List Able",
  // "Order",
];

export const EntityCrudSettings = () => {
  const entity = useEntitySlug();
  const entityCrudSettings = useEntityCrudSettings();
  const entityScalarFields = useEntityScalarFields(entity);

  const hiddenTableColumns = useSelectedEntityColumns(
    "hidden_entity_table_columns"
  );
  const hiddenCreateColumns = useSelectedEntityColumns(
    "hidden_entity_create_columns"
  );
  const hiddenUpdateColumns = useSelectedEntityColumns(
    "hidden_entity_update_columns"
  );
  const hiddenDetailsColumns = useSelectedEntityColumns(
    "hidden_entity_details_columns"
  );

  const upsertTableColumnsMutation = useUpsertConfigurationMutation(
    "hidden_entity_table_columns",
    entity
  );

  const upsertCreateColumnsMutation = useUpsertConfigurationMutation(
    "hidden_entity_create_columns",
    entity
  );

  const upsertUpdateColumnsMutation = useUpsertConfigurationMutation(
    "hidden_entity_update_columns",
    entity
  );

  const upsertDetailsColumnsMutation = useUpsertConfigurationMutation(
    "hidden_entity_details_columns",
    entity
  );

  const [entityCrudSettingsState, setEntityCrudSettingsState] =
    useState<IEntityCrudSettings>({
      create: true,
      delete: true,
      details: true,
      table: true,
      update: true,
    });

  useEffect(() => {
    if (entityCrudSettings.data) {
      setEntityCrudSettingsState(entityCrudSettings.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityCrudSettings.data]);

  const toggleCrudSettings = (field: keyof IEntityCrudSettings) => {
    setEntityCrudSettingsState({
      ...entityCrudSettingsState,
      [field]: !entityCrudSettingsState[field],
    });
  };

  return (
    <BaseEntitySettingsLayout
      menuItem={{
        link: NAVIGATION_LINKS.ENTITY.CONFIG.CRUD(entity),
        name: "CRUD Settings",
      }}
    >
      <ErrorAlert
        message={entityScalarFields.error || entityScalarFields.error}
      />
      {entityScalarFields.isLoading || entityCrudSettings.isLoading ? (
        <>Loading...</>
      ) : (
        <SectionBox title="CRUD Settings">
          <Tabs
            // TODO add default tab
            contents={[
              {
                content: (
                  <SelectionTab
                    description="Toggle the fields that are allowed to be created in the Form"
                    entityFields={entityScalarFields.data || []}
                    isLoading={hiddenCreateColumns.isLoading}
                    hiddenColumns={hiddenCreateColumns.data || []}
                    onSubmit={(data) => upsertCreateColumnsMutation.mutateAsync(data)}
                    onToggle={() => toggleCrudSettings("create")}
                    enabled={entityCrudSettingsState.create}
                    labels={["Hide Create Button", "Show Create Button"]}
                  />
                ),
                label: "Create",
              },
              {
                content: (
                  <SelectionTab
                    description="Toggle the fields that are allowed to be updated in the Form"
                    entityFields={entityScalarFields.data || []}
                    isLoading={hiddenUpdateColumns.isLoading}
                    hiddenColumns={hiddenUpdateColumns.data || []}
                    onToggle={() => toggleCrudSettings("update")}
                    onSubmit={(data) => upsertUpdateColumnsMutation.mutateAsync(data)}
                    enabled={entityCrudSettingsState.update}
                    labels={["Hide Edit Button", "Show Edit Button"]}
                  />
                ),
                label: "Update",
              },
              {
                content: (
                  <SelectionTab
                    description="Toggle the fields that should be shown in the details page"
                    entityFields={entityScalarFields.data || []}
                    isLoading={hiddenDetailsColumns.isLoading}
                    hiddenColumns={hiddenDetailsColumns.data || []}
                    onToggle={() => toggleCrudSettings("details")}
                    onSubmit={(data) => upsertDetailsColumnsMutation.mutateAsync(data)}
                    enabled={entityCrudSettingsState.details}
                    labels={["Hide Details Button", "Show Details Button"]}
                  />
                ),
                label: "Details",
              },
              {
                content: (
                  <SelectionTab
                    description="Toggle the columns that should be shown in the table"
                    entityFields={entityScalarFields.data || []}
                    isLoading={hiddenTableColumns.isLoading}
                    onToggle={() => toggleCrudSettings("table")}
                    hiddenColumns={hiddenTableColumns.data || []}
                    onSubmit={(data) => upsertTableColumnsMutation.mutateAsync(data)}
                    enabled={entityCrudSettingsState.table}
                    labels={["Hide In Table List", "Show In Table List"]}
                  />
                ),
                label: "Table",
              },
              {
                content: (
                  <SelectionTab
                    description=""
                    entityFields={[]}
                    isLoading={false}
                    onToggle={() => toggleCrudSettings("delete")}
                    hiddenColumns={[]}
                    onSubmit={async () => noop()}
                    enabled={entityCrudSettings.data?.delete}
                    labels={["Hide Delete Button", "Show Delete Button"]}
                  />
                ),
                label: "Delete",
              },
            ]}
          />
        </SectionBox>
      )}
    </BaseEntitySettingsLayout>
  );
};
