import { Tabs, SectionBox } from "@hadmean/chromista";
import noop from "lodash/noop";
import { useEffect, useState } from "react";
import {
  ENTITY_LIST_PATH,
  ENTITY_TABLE_PATH,
} from "frontend/hooks/data/data.store";
import { SLUG_LOADING_VALUE } from "@hadmean/protozoa";
import { IEntityCrudSettings } from "shared/configuration.constants";
import {
  useSetPageDetails,
  useChangeRouterParam,
  useRouteParam,
} from "frontend/lib/routing";
import { USER_PERMISSIONS } from "shared/types";
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

  return {
    [ENTITY_CRUD_SETTINGS_TAB_LABELS.TABLE]: (
      <SelectionTab
        getEntityFieldLabels={getEntityFieldLabels}
        entityFields={entityFields.data || []}
        isLoading={sharedLoading || hiddenTableColumns.isLoading}
        hiddenColumns={hiddenTableColumns.data || []}
        onSubmit={async (data) => {
          upsertTableColumnsMutation.mutateAsync(data);
        }}
        enabled
        error={error}
        labels={["Hide In Table List", "Show In Table List"]}
      />
    ),
    [ENTITY_CRUD_SETTINGS_TAB_LABELS.DETAILS]: (
      <SelectionTab
        getEntityFieldLabels={getEntityFieldLabels}
        entityFields={entityFields.data || []}
        isLoading={sharedLoading || hiddenDetailsColumns.isLoading}
        hiddenColumns={hiddenDetailsColumns.data || []}
        onToggle={() => toggleCrudSettings("details")}
        error={error}
        // TODO if you disable details then disable update
        onSubmit={async (data) => {
          upsertDetailsColumnsMutation.mutateAsync(data);
        }}
        enabled={entityCrudSettingsState.details}
        labels={["Hide Details Button", "Show Details Button"]}
      />
    ),
    [ENTITY_CRUD_SETTINGS_TAB_LABELS.CREATE]: (
      <SelectionTab
        getEntityFieldLabels={getEntityFieldLabels}
        entityFields={entityFields.data || []}
        isLoading={sharedLoading || hiddenCreateColumns.isLoading}
        hiddenColumns={hiddenCreateColumns.data || []}
        error={error}
        onSubmit={async (data) => {
          await upsertCreateColumnsMutation.mutateAsync(data);
        }}
        onToggle={() => toggleCrudSettings("create")}
        enabled={entityCrudSettingsState.create}
        labels={["Hide Create Button", "Show Create Button"]}
      />
    ),
    [ENTITY_CRUD_SETTINGS_TAB_LABELS.UPDATE]: (
      <SelectionTab
        getEntityFieldLabels={getEntityFieldLabels}
        entityFields={entityFields.data || []}
        isLoading={sharedLoading || hiddenUpdateColumns.isLoading}
        hiddenColumns={hiddenUpdateColumns.data || []}
        error={error}
        onToggle={() => toggleCrudSettings("update")}
        onSubmit={async (data) => {
          await upsertUpdateColumnsMutation.mutateAsync(data);
        }}
        // TODO If you enable update then enable details
        enabled={entityCrudSettingsState.update}
        labels={["Hide Edit Button", "Show Edit Button"]}
      />
    ),
    [ENTITY_CRUD_SETTINGS_TAB_LABELS.DELETE]: (
      <SelectionTab
        entityFields={[]}
        isLoading={false}
        error={error}
        onToggle={() => toggleCrudSettings("delete")}
        hiddenColumns={[]}
        getEntityFieldLabels={() => "Shoud not see this"}
        onSubmit={async () => noop()}
        enabled={entityCrudSettingsState.delete}
        labels={["Hide Delete Button", "Show Delete Button"]}
      />
    ),
  };
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
          contents={Object.entries(entityCrudView).map(([key, value]) => ({
            label: key,
            content: value,
          }))}
        />
      </SectionBox>
    </BaseEntitySettingsLayout>
  );
}
