import { ReactNode, useEffect, useState } from "react";
import {
  ENTITY_LIST_PATH,
  ENTITY_TABLE_PATH,
} from "frontend/hooks/data/data.store";
import { SLUG_LOADING_VALUE } from "frontend/lib/routing/constants";
import { IEntityCrudSettings } from "shared/configurations";
import { USER_PERMISSIONS } from "shared/constants/user";
import { DOCUMENTATION_LABEL } from "frontend/docs";
import { CRUDDocumentation } from "frontend/docs/crud";
import { useRouteParam } from "frontend/lib/routing/useRouteParam";
import { useChangeRouterParam } from "frontend/lib/routing/useChangeRouterParam";
import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import { SectionBox } from "frontend/design-system/components/Section/SectionBox";
import { Tabs } from "frontend/design-system/components/Tabs";
import {
  useEntityCrudSettings,
  useEntityFieldLabels,
  useEntitySlug,
} from "frontend/hooks/entity/entity.config";
import {
  useEntityConfiguration,
  useUpsertConfigurationMutation,
} from "frontend/hooks/configuration/configuration.store";
import { useEntityFields } from "frontend/hooks/entity/entity.store";
import { BaseEntitySettingsLayout } from "../_Base";
import { SelectionTab } from "./SelectionTab";

import {
  ENTITY_CONFIGURATION_VIEW,
  ENTITY_CRUD_SETTINGS_TAB_LABELS,
} from "../constants";

const DOCS_TITLE = "CRUD Settings";

function useEntityCrudView() {
  const entity = useEntitySlug();

  const entityCrudSettings = useEntityCrudSettings();
  const entityFields = useEntityFields(entity);

  const getEntityFieldLabels = useEntityFieldLabels();

  const hiddenTableColumns = useEntityConfiguration<string[]>(
    "hidden_entity_table_columns",
    entity
  );
  const hiddenCreateColumns = useEntityConfiguration<string[]>(
    "hidden_entity_create_columns",
    entity
  );
  const hiddenUpdateColumns = useEntityConfiguration<string[]>(
    "hidden_entity_update_columns",
    entity
  );
  const hiddenDetailsColumns = useEntityConfiguration<string[]>(
    "hidden_entity_details_columns",
    entity
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
  }, [JSON.stringify(entityCrudSettings.data)]);

  const toggleCrudSettings = (field: keyof IEntityCrudSettings) => {
    const newState = {
      ...entityCrudSettingsState,
      [field]: !entityCrudSettingsState[field],
    };

    if (field === "details" && !newState.details) {
      newState.update = false;
      newState.delete = false;
    } else if (field === "update" && newState.update) {
      newState.details = true;
    } else if (field === "delete" && newState.delete) {
      newState.details = true;
    }

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
            fields: entityFields.data,
            submit: async (data) => {
              await upsertTableColumnsMutation.mutateAsync(data);
            },
            hidden: hiddenTableColumns.data,
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
            fields: entityFields.data,
            submit: async (data) => {
              await upsertDetailsColumnsMutation.mutateAsync(data);
            },
            hidden: hiddenDetailsColumns.data,
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
            fields: entityFields.data,
            submit: async (data) => {
              await upsertCreateColumnsMutation.mutateAsync(data);
            },
            hidden: hiddenCreateColumns.data,
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
            fields: entityFields.data,
            submit: async (data) => {
              await upsertUpdateColumnsMutation.mutateAsync(data);
            },
            hidden: hiddenUpdateColumns.data,
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
  const [isDocOpen, setIsDocOpen] = useState(false);

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
            action: () => setIsDocOpen(true),
            icon: "help",
            label: DOCUMENTATION_LABEL.CONCEPT(DOCS_TITLE),
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
      <CRUDDocumentation
        title={DOCS_TITLE}
        close={setIsDocOpen}
        isOpen={isDocOpen}
      />
    </BaseEntitySettingsLayout>
  );
}
