import { ReactNode, useEffect, useState } from "react";
import { CrudViewsKeys, IEntityCrudSettings } from "shared/configurations";
import { USER_PERMISSIONS } from "shared/constants/user";
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
import { useUpsertConfigurationMutation } from "frontend/hooks/configuration/configuration.store";
import { useEntityFields } from "frontend/hooks/entity/entity.store";
import { WarningAlert } from "frontend/design-system/components/Alert";
import { Spacer } from "frontend/design-system/primitives/Spacer";
import { useDocumentationActionButton } from "frontend/docs/constants";
import { msg } from "@lingui/macro";
import { typescriptSafeObjectDotEntries } from "shared/lib/objects";
import { BaseEntitySettingsLayout } from "../_Base";
import {
  EntityFieldsSelectionSettings,
  ToggleCrudState,
} from "./EntityFieldsSelectionSettings";
import { ENTITY_CONFIGURATION_VIEW, ENTITY_CRUD_LABELS } from "../constants";
import {
  PortalEntityTableSettings,
  PortalEntityCreateSettings,
  PortalEntityDetailsSettings,
  PortalEntityUpdateSettings,
} from "./portal";

const TITLE = msg`CRUD Settings`;

function useEntityCrudView(entity: string) {
  const entityCrudSettings = useEntityCrudSettings(entity);
  const entityFields = useEntityFields(entity);

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

  const sharedLoading = entityFields.isLoading || entityCrudSettings.isLoading;

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

  const schema: Record<
    CrudViewsKeys,
    { disabled: boolean; render: ReactNode }
  > = {
    table: {
      disabled: false,
      render: (
        <>
          <EntityFieldsSelectionSettings
            crudKey="table"
            isLoading={sharedLoading}
            toggling={{
              enabled: true,
            }}
            error={error}
          />
          <PortalEntityTableSettings />
        </>
      ),
    },
    details: {
      disabled: !entityCrudSettingsState.details,
      render: (
        <>
          <EntityFieldsSelectionSettings
            crudKey="details"
            isLoading={sharedLoading}
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
    create: {
      disabled: !entityCrudSettingsState.create,
      render: (
        <>
          <EntityFieldsSelectionSettings
            crudKey="create"
            isLoading={sharedLoading}
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
    update: {
      disabled: !entityCrudSettingsState.update,
      render: (
        <>
          <EntityFieldsSelectionSettings
            crudKey="update"
            toggling={{
              onToggle: () => toggleCrudSettings("update"),
              enabled: entityCrudSettingsState.update,
            }}
            isLoading={sharedLoading}
            error={error}
          />
          <PortalEntityUpdateSettings />
        </>
      ),
    },
    delete: {
      disabled: !entityCrudSettingsState.delete,
      render: (
        <ToggleCrudState
          crudKey="delete"
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
  const entityFields = useEntityFields(entity);

  const entityCrudView = useEntityCrudView(entity);

  const documentationActionButton = useDocumentationActionButton(TITLE);

  useSetPageDetails({
    pageTitle: TITLE,
    viewKey: ENTITY_CONFIGURATION_VIEW,
    permission: USER_PERMISSIONS.CAN_CONFIGURE_APP,
  });
  return (
    <BaseEntitySettingsLayout>
      {entityFields.data.length > 1 &&
        entityFields.data.findIndex((field) => field.isId) === -1 && (
          <>
            <WarningAlert message="This entity doesn't have a primary key. Kindly add one to this entity and restart the application so as not to run into errors when managing its data" />
            <Spacer />
          </>
        )}
      <SectionBox title={TITLE} actionButtons={[documentationActionButton]}>
        <Tabs
          currentTab={tabFromUrl}
          onChange={changeTabParam}
          contents={typescriptSafeObjectDotEntries(entityCrudView).map(
            ([key, { disabled, render }]) => ({
              label: ENTITY_CRUD_LABELS[key],
              id: key,
              content: render,
              disabled,
            })
          )}
        />
      </SectionBox>
      <CRUDDocumentation />
    </BaseEntitySettingsLayout>
  );
}
