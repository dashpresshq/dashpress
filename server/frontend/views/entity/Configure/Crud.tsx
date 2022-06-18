import {
  ErrorAlert,
  FormButton,
  Tabs,
  Text,
  RenderList,
  SectionListItem,
  Stack,
  SectionBox,
  Spacer,
} from "@gothicgeeks/design-system";
import {
  IEntityCrudSettings,
  useEntityCrudSettings,
  useEntitySlug,
  useSelectedEntityColumns,
} from "../../../hooks/entity/entity.config";
import { NAVIGATION_LINKS } from "../../../lib/routing/links";
import { BaseEntitySettingsLayout } from "./_Base";
import { ButtonLang } from "@gothicgeeks/shared";
import { IFormProps } from "../../../lib/form/types";
import { useUpsertConfigurationMutation } from "../../../hooks/configuration/configration.store";
import { useEntityScalarFields } from "../../../hooks/entity/entity.store";
import { IEntityField } from "../../../../backend/entities/types";
import { useStringSelections } from "../../../lib/selection";
import { useEffect, useState } from "react";

const LABELS = [
  // "List Able",
  // "Order",
];

export const EntityCrudSettings = () => {
  const entity = useEntitySlug();
  const entityCrudSettings = useEntityCrudSettings();
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

  const entityScalarFields = useEntityScalarFields(entity);

  const upsertConfigurationMutation = useUpsertConfigurationMutation(
    "entity_crud_settings",
    entity
  );

  const [entityCrudSettingsState, setEntityCrudSettingsState] =
    useState<IEntityCrudSettings>();

  useEffect(() => {
    setEntityCrudSettingsState(entityCrudSettings.data);
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
        <SectionBox title="Diction Settings">
          <Tabs
            // TODO add default tab
            contents={[
              {
                content: (
                  <SelectionTab
                    description="Foo"
                    entityFields={entityScalarFields.data || []}
                    isLoading={hiddenCreateColumns.isLoading}
                    hiddenColumns={hiddenCreateColumns.data || []}
                    onSubmit={(data) => {
                      upsertConfigurationMutation.mutateAsync(data);
                    }}
                    onToggle={() => toggleCrudSettings("create")}
                    enabled={entityCrudSettingsState.create}
                  />
                ),
                label: "Create",
              },
              {
                content: (
                  <SelectionTab
                    description="Foo"
                    entityFields={entityScalarFields.data || []}
                    isLoading={hiddenUpdateColumns.isLoading}
                    hiddenColumns={hiddenCreateColumns.data || []}
                    onToggle={() => toggleCrudSettings("update")}
                    onSubmit={(data) => {
                      upsertConfigurationMutation.mutateAsync(data);
                    }}
                    enabled={entityCrudSettingsState.update}
                  />
                ),
                label: "Update",
              },
              {
                content: (
                  <SelectionTab
                    description="Foo"
                    entityFields={entityScalarFields.data || []}
                    isLoading={hiddenDetailsColumns.isLoading}
                    hiddenColumns={hiddenDetailsColumns.data || []}
                    onToggle={() => toggleCrudSettings("details")}
                    onSubmit={(data) => {
                      upsertConfigurationMutation.mutateAsync(data);
                    }}
                    enabled={entityCrudSettingsState.details}
                  />
                ),
                label: "Details",
              },
              {
                content: (
                  <SelectionTab
                    description="Foo"
                    entityFields={entityScalarFields.data || []}
                    isLoading={hiddenTableColumns.isLoading}
                    onToggle={() => toggleCrudSettings("table")}
                    hiddenColumns={hiddenTableColumns.data || []}
                    onSubmit={(data) => {
                      upsertConfigurationMutation.mutateAsync(data);
                    }}
                    enabled={entityCrudSettingsState.table}
                  />
                ),
                label: "Table",
              },
              {
                content: (
                  <SelectionTab
                    description="Foo"
                    entityFields={[]}
                    isLoading={false}
                    onToggle={() => toggleCrudSettings("delete")}
                    hiddenColumns={[]}
                    onSubmit={(data) => {
                      upsertConfigurationMutation.mutateAsync(data);
                    }}
                    enabled={entityCrudSettings.data?.delete}
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

const SelectionTab: React.FC<{
  entityFields: IEntityField[];
  isLoading: boolean;
  onToggle: () => void;
  hiddenColumns: string[];
  enabled: boolean;
  description: string;
}> = ({
  entityFields,
  isLoading,
  enabled,
  description,
  onToggle,
  hiddenColumns,
}) => {
  const { toggleSelection, clearAll, currentPageSelection, selectMutiple } =
    useStringSelections();

  useEffect(() => {
    selectMutiple(hiddenColumns);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hiddenColumns]);

  return (
    <>
      <Stack justify="space-between">
        <Text size="5">{description}</Text>
        <FormButton
          isMakingRequest={false}
          size="sm"
          isInverse={enabled}
          text="Enable Create"
          onClick={() => onToggle()}
        />
      </Stack>
      <Spacer size="xxl" />
      {entityFields.length > 0 && (
        <RenderList
          items={entityFields}
          render={(menuItem) => {
            const isHidden = currentPageSelection.includes(menuItem.name);

            return (
              <SectionListItem
                label={menuItem.name}
                key={menuItem.name}
                actionButtons={
                  enabled
                    ? [
                        {
                          isInverse: isHidden,
                          text: isHidden ? "Hide" : "Show",
                          onClick: () => toggleSelection(menuItem.name),
                          isMakingRequest: false,
                        },
                      ]
                    : []
                }
                toNoWhere={true}
              />
            );
          }}
        />
      )}

      <Spacer size="xxl" />
      <FormButton
        text={"Save Changes"}
        disabled={false}
        isMakingRequest={false}
      />
    </>
  );
};
