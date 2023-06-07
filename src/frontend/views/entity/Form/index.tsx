import { Tabs, SectionBox } from "@hadmean/chromista";
import { SLUG_LOADING_VALUE } from "@hadmean/protozoa";
import { useSetPageDetails } from "frontend/lib/routing";
import { USER_PERMISSIONS } from "shared/constants/user";
import { IFormExtension } from "frontend/components/SchemaForm/types";
import { LINK_TO_DOCS } from "frontend/views/constants";
import { MAKE_APP_CONFIGURATION_CRUD_CONFIG } from "frontend/hooks/configuration/configuration.constant";
import {
  useEntityConfiguration,
  useUpsertConfigurationMutation,
} from "frontend/hooks/configuration/configuration.store";
import { useEntitySlug } from "../../../hooks/entity/entity.config";
import { BaseEntitySettingsLayout } from "../_Base";

import { ENTITY_CONFIGURATION_VIEW } from "../constants";
import { ScriptForm } from "./ScriptForm";

function useEntityFormView() {
  const entity = useEntitySlug();

  const entityFormExtensionSettings = useEntityConfiguration<IFormExtension>(
    "entity_form_extension",
    entity
  );

  const upsertEntityFormExtensionSettingsMutation =
    useUpsertConfigurationMutation("entity_form_extension", entity);

  const isLoading =
    entityFormExtensionSettings.isLoading || entity === SLUG_LOADING_VALUE;

  const { error } = entityFormExtensionSettings;

  const onScriptSubmit =
    (key: keyof IFormExtension) => async (value: string) => {
      await upsertEntityFormExtensionSettingsMutation.mutateAsync({
        ...entityFormExtensionSettings.data,
        [key]: value,
      });
    };

  return {
    "Fields State": (
      <ScriptForm
        value={entityFormExtensionSettings.data?.fieldsState}
        isLoading={isLoading}
        onSubmit={onScriptSubmit("fieldsState")}
        field="fieldsState"
        error={error}
      />
    ),
    "Before Submit": (
      <ScriptForm
        value={entityFormExtensionSettings.data?.beforeSubmit}
        isLoading={isLoading}
        field="beforeSubmit"
        onSubmit={onScriptSubmit("beforeSubmit")}
        error={error}
      />
    ),
  };
}

const CRUD_CONFIG = MAKE_APP_CONFIGURATION_CRUD_CONFIG("entity_form_extension");

export function EntityFormExtensionSettings() {
  const entityFormView = useEntityFormView();
  useSetPageDetails({
    pageTitle: CRUD_CONFIG.TEXT_LANG.TITLE,
    viewKey: ENTITY_CONFIGURATION_VIEW,
    permission: USER_PERMISSIONS.CAN_CONFIGURE_APP,
  });
  return (
    <BaseEntitySettingsLayout>
      <SectionBox
        title={CRUD_CONFIG.TEXT_LANG.TITLE}
        iconButtons={[
          {
            action: LINK_TO_DOCS("app-configuration/form"),
            icon: "help",
            label: "Form Scripts Documentation",
          },
        ]}
      >
        <Tabs
          contents={Object.entries(entityFormView).map(([key, value]) => ({
            label: key,
            content: value,
          }))}
        />
      </SectionBox>
    </BaseEntitySettingsLayout>
  );
}
