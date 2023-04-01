import { Tabs, SectionBox } from "@hadmean/chromista";
import { ReactNode, useEffect, useState } from "react";
import {
  ENTITY_LIST_PATH,
  ENTITY_TABLE_PATH,
} from "frontend/hooks/data/data.store";
import { SLUG_LOADING_VALUE } from "@hadmean/protozoa";
import { IEntityCrudSettings } from "shared/configurations";
import {
  useSetPageDetails,
  useChangeRouterParam,
  useRouteParam,
} from "frontend/lib/routing";
import { USER_PERMISSIONS } from "shared/constants/user";
import { LINK_TO_DOCS } from "frontend/views/constants";
import {
  useEntityCrudSettings,
  useEntityFieldLabels,
  useEntitySlug,
  useSelectedEntityColumns,
} from "../../../hooks/entity/entity.config";
import { BaseEntitySettingsLayout } from "../_Base";
import { useUpsertConfigurationMutation } from "../../../hooks/configuration/configuration.store";
import { useEntityFields } from "../../../hooks/entity/entity.store";
import { SelectionTab } from "./SelectionTab";

import {
  ENTITY_CONFIGURATION_VIEW,
  ENTITY_CRUD_SETTINGS_TAB_LABELS,
} from "../constants";

function useEntityCrudView() {
  const entity = useEntitySlug();

  const entityCrudSettings = useEntityCrudSettings();
  const entityFields = useEntityFields(entity);

  const getEntityFieldLabels = useEntityFieldLabels();

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
    entity,
    {
      otherEndpoints: [ENTITY_TABLE_PATH(entity)],
    }
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
    entity,
    {
      /* This is an hack for  ENTITY_DETAILS_PATH(entity, id) to clear all details 
      and it quite necessary for the detail page */
      otherEndpoints: [ENTITY_LIST_PATH(entity)],
    }
  );

  const upsertCrudSettingsMutation = useUpsertConfigurationMutation(
    "entity_crud_settings",
    entity
  );

  const [entityCrudSettingsState, setEntityCrudSettingsState] =
    useState<IEntityCrudSettings>({
      create: true,
      delete: true,
      details: true,
      update: true,
    });

  const sharedLoading =
    entityFields.isLoading ||
    entityCrudSettings.isLoading ||
    entity === SLUG_LOADING_VALUE;

  useEffect(() => {
    if (entityCrudSettings.data) {
      setEntityCrudSettingsState(entityCrudSettings.data);
    }
  }, [entityCrudSettings.data]);

  const toggleCrudSettings = (field: keyof IEntityCrudSettings) => {
    const newState = {
      ...entityCrudSettingsState,
      [field]: !entityCrudSettingsState[field],
    };
    setEntityCrudSettingsState(newState);
    upsertCrudSettingsMutation.mutateAsync(
      newState as unknown as Record<string, string>
    );
  };

  const error = entityFields.error || entityCrudSettings.error;

  const schema: Record<string, { disabled: boolean; render: ReactNode }> = {
    [ENTITY_CRUD_SETTINGS_TAB_LABELS.TABLE]: {
      disabled: false,
      render: (
        <SelectionTab
          label={ENTITY_CRUD_SETTINGS_TAB_LABELS.TABLE}
          columns={{
            fields: entityFields.data || [],
            submit: async (data) => {
              await upsertTableColumnsMutation.mutateAsync(data);
            },
            hidden: hiddenTableColumns.data || [],
            getEntityFieldLabels,
          }}
          isLoading={sharedLoading || hiddenTableColumns.isLoading}
          toggling={{
            enabled: true,
            label: ENTITY_CRUD_SETTINGS_TAB_LABELS.TABLE,
          }}
          error={error}
        />
      ),
    },
    [ENTITY_CRUD_SETTINGS_TAB_LABELS.DETAILS]: {
      disabled: !entityCrudSettingsState.details,
      render: (
        <SelectionTab
          label={ENTITY_CRUD_SETTINGS_TAB_LABELS.DETAILS}
          columns={{
            fields: entityFields.data || [],
            submit: async (data) => {
              await upsertDetailsColumnsMutation.mutateAsync(data);
            },
            hidden: hiddenDetailsColumns.data || [],
            getEntityFieldLabels,
          }}
          isLoading={sharedLoading || hiddenDetailsColumns.isLoading}
          error={error}
          toggling={{
            onToggle: () => toggleCrudSettings("details"),
            enabled: entityCrudSettingsState.details,
            label: ENTITY_CRUD_SETTINGS_TAB_LABELS.DETAILS,
          }}
        />
      ),
    },
    [ENTITY_CRUD_SETTINGS_TAB_LABELS.CREATE]: {
      disabled: !entityCrudSettingsState.create,
      render: (
        <SelectionTab
          label={ENTITY_CRUD_SETTINGS_TAB_LABELS.CREATE}
          columns={{
            fields: entityFields.data || [],
            submit: async (data) => {
              await upsertCreateColumnsMutation.mutateAsync(data);
            },
            hidden: hiddenCreateColumns.data || [],
            getEntityFieldLabels,
          }}
          isLoading={sharedLoading || hiddenCreateColumns.isLoading}
          error={error}
          toggling={{
            onToggle: () => toggleCrudSettings("create"),
            enabled: entityCrudSettingsState.create,
            label: ENTITY_CRUD_SETTINGS_TAB_LABELS.CREATE,
          }}
        />
      ),
    },
    [ENTITY_CRUD_SETTINGS_TAB_LABELS.UPDATE]: {
      disabled: !entityCrudSettingsState.update,
      render: (
        <SelectionTab
          label={ENTITY_CRUD_SETTINGS_TAB_LABELS.UPDATE}
          columns={{
            fields: entityFields.data || [],
            submit: async (data) => {
              await upsertUpdateColumnsMutation.mutateAsync(data);
            },
            hidden: hiddenUpdateColumns.data || [],
            getEntityFieldLabels,
          }}
          toggling={{
            onToggle: () => toggleCrudSettings("update"),
            enabled: entityCrudSettingsState.update,
            label: ENTITY_CRUD_SETTINGS_TAB_LABELS.UPDATE,
          }}
          isLoading={sharedLoading || hiddenUpdateColumns.isLoading}
          error={error}
        />
      ),
    },
    [ENTITY_CRUD_SETTINGS_TAB_LABELS.DELETE]: {
      disabled: !entityCrudSettingsState.delete,
      render: (
        <SelectionTab
          label={ENTITY_CRUD_SETTINGS_TAB_LABELS.DELETE}
          isLoading={false}
          error={error}
          toggling={{
            onToggle: () => toggleCrudSettings("delete"),
            enabled: entityCrudSettingsState.delete,
            label: ENTITY_CRUD_SETTINGS_TAB_LABELS.DELETE,
          }}
        />
      ),
    },
  };
  return schema;
}

export function EntityCrudSettings() {
  const tabFromUrl = useRouteParam("tab");
  const changeTabParam = useChangeRouterParam("tab");
  const entityCrudView = useEntityCrudView();

  useSetPageDetails({
    pageTitle: "CRUD Settings",
    viewKey: ENTITY_CONFIGURATION_VIEW,
    permission: USER_PERMISSIONS.CAN_CONFIGURE_APP,
  });
  return (
    <BaseEntitySettingsLayout>
      <SectionBox
        title="CRUD Settings"
        iconButtons={[
          {
            action: LINK_TO_DOCS("app-configuration/crud"),
            icon: "help",
            label: "CRUD Settings Documentation",
          },
        ]}
      >
        <Tabs
          currentTab={tabFromUrl}
          onChange={changeTabParam}
          contents={Object.entries(entityCrudView).map(
            ([key, { disabled, render }]) => ({
              label: key,
              content: render,
              disabled,
            })
          )}
        />
      </SectionBox>
    </BaseEntitySettingsLayout>
  );
}
