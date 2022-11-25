import { Tabs, SectionBox } from "@hadmean/chromista";
import { SLUG_LOADING_VALUE } from "@hadmean/protozoa";
import { useSetPageDetails } from "frontend/lib/routing";
import { USER_PERMISSIONS } from "shared/types/user";
import { IFormExtension } from "frontend/lib/form/types";
import { LINK_TO_DOCS } from "frontend/views/constants";
import { useEntitySlug } from "../../../hooks/entity/entity.config";
import { BaseEntitySettingsLayout } from "../_Base";
import {
  useEntityConfiguration,
  useUpsertConfigurationMutation,
} from "../../../hooks/configuration/configuration.store";
import { useEntityFields } from "../../../hooks/entity/entity.store";

import { ENTITY_CONFIGURATION_VIEW } from "../constants";
import { ScriptForm } from "./ScriptForm";

function useEntityFormView() {
  const entity = useEntitySlug();

  const entityFields = useEntityFields(entity);

  const entityFormExtensionSettings = useEntityConfiguration<IFormExtension>(
    "entity_form_extension",
    entity
  );

  const upsertEntityFormExtensionSettingsMutation =
    useUpsertConfigurationMutation("entity_form_extension", entity);

  const isLoading =
    entityFields.isLoading ||
    entityFormExtensionSettings.isLoading ||
    entity === SLUG_LOADING_VALUE;

  const error = entityFields.error || entityFormExtensionSettings.error;

  const onScriptSubmit =
    (key: keyof IFormExtension) => async (value: string) => {
      upsertEntityFormExtensionSettingsMutation.mutateAsync({
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

export function EntityFormExtensionSettings() {
  const entityFormView = useEntityFormView();
  useSetPageDetails({
    pageTitle: "Form Settings",
    viewKey: ENTITY_CONFIGURATION_VIEW,
    permission: USER_PERMISSIONS.CAN_CONFIGURE_APP,
  });
  return (
    <BaseEntitySettingsLayout>
      <SectionBox
        title="Form Scripts"
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
