import { ReactNode, useEffect, useState } from "react";
import {
  ENTITY_LIST_PATH,
  ENTITY_TABLE_PATH,
} from "frontend/hooks/data/constants";
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
  useEntitySlug,
} from "frontend/hooks/entity/entity.config";
import {
  useEntityConfiguration,
  useUpsertConfigurationMutation,
} from "frontend/hooks/configuration/configuration.store";
import { useEntityFields } from "frontend/hooks/entity/entity.store";
import { BaseEntitySettingsLayout } from "../_Base";
import { EntityFieldsSelectionSettings } from "./EntityFieldsSelectionSettings";
import { ENTITY_CONFIGURATION_VIEW, ENTITY_CRUD_LABELS } from "../constants";
import {
  PortalEntityTableSettings,
  PortalEntityCreateSettings,
  PortalEntityDetailsSettings,
  PortalEntityUpdateSettings,
} from "./portal";

const DOCS_TITLE = "CRUD Settings";

function useEntityCrudView(entity: string) {
  const entityCrudSettings = useEntityCrudSettings(entity);
  const entityFields = useEntityFields(entity);

  const hiddenTableColumns = useEntityConfiguration(
    "hidden_entity_table_columns",
    entity
  );
  const hiddenCreateColumns = useEntityConfiguration(
    "hidden_entity_create_columns",
    entity
  );
  const hiddenUpdateColumns = useEntityConfiguration(
    "hidden_entity_update_columns",
    entity
  );
  const hiddenDetailsColumns = useEntityConfiguration(
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
    upsertCrudSettingsMutation.mutateAsync(newState);
  };

  const error = entityFields.error || entityCrudSettings.error;

  const schema: Record<string, { disabled: boolean; render: ReactNode }> = {
    [ENTITY_CRUD_LABELS.table]: {
      disabled: false,
      render: (
        <>
          <EntityFieldsSelectionSettings
            crudKey="table"
            columns={{
              submit: upsertTableColumnsMutation.mutateAsync,
              hidden: hiddenTableColumns.data,
            }}
            isLoading={sharedLoading || hiddenTableColumns.isLoading}
            toggling={{
              enabled: true,
            }}
            error={error}
          />
          <PortalEntityTableSettings />
        </>
      ),
    },
    [ENTITY_CRUD_LABELS.details]: {
      disabled: !entityCrudSettingsState.details,
      render: (
        <>
          <EntityFieldsSelectionSettings
            crudKey="details"
            columns={{
              submit: upsertDetailsColumnsMutation.mutateAsync,
              hidden: hiddenDetailsColumns.data,
            }}
            isLoading={sharedLoading || hiddenDetailsColumns.isLoading}
            error={error}
            toggling={{
              onToggle: () => toggleCrudSettings("details"),
              enabled: entityCrudSettingsState.details,
            }}
          />
          <PortalEntityDetailsSettings />
        </>
      ),
    },
    [ENTITY_CRUD_LABELS.create]: {
      disabled: !entityCrudSettingsState.create,
      render: (
        <>
          <EntityFieldsSelectionSettings
            crudKey="create"
            columns={{
              submit: upsertCreateColumnsMutation.mutateAsync,
              hidden: hiddenCreateColumns.data,
            }}
            isLoading={sharedLoading || hiddenCreateColumns.isLoading}
            error={error}
            toggling={{
              onToggle: () => toggleCrudSettings("create"),
              enabled: entityCrudSettingsState.create,
            }}
          />
          <PortalEntityCreateSettings />
        </>
      ),
    },
    [ENTITY_CRUD_LABELS.update]: {
      disabled: !entityCrudSettingsState.update,
      render: (
        <>
          <EntityFieldsSelectionSettings
            crudKey="update"
            columns={{
              submit: upsertUpdateColumnsMutation.mutateAsync,
              hidden: hiddenUpdateColumns.data,
            }}
            toggling={{
              onToggle: () => toggleCrudSettings("update"),
              enabled: entityCrudSettingsState.update,
            }}
            isLoading={sharedLoading || hiddenUpdateColumns.isLoading}
            error={error}
          />
          <PortalEntityUpdateSettings />
        </>
      ),
    },
    [ENTITY_CRUD_LABELS.delete]: {
      disabled: !entityCrudSettingsState.delete,
      render: (
        <EntityFieldsSelectionSettings
          crudKey="delete"
          isLoading={false}
          error={error}
          toggling={{
            onToggle: () => toggleCrudSettings("delete"),
            enabled: entityCrudSettingsState.delete,
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
  const entity = useEntitySlug();

  const entityCrudView = useEntityCrudView(entity);
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
        actionButtons={[
          {
            _type: "normal",
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
