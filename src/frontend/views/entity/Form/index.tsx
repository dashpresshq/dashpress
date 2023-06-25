import { Tabs, SectionBox } from "@hadmean/chromista";
import { SLUG_LOADING_VALUE } from "frontend/lib/routing/constants";
import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import { USER_PERMISSIONS } from "shared/constants/user";
import { IFormExtension } from "frontend/components/SchemaForm/types";
import { MAKE_APP_CONFIGURATION_CRUD_CONFIG } from "frontend/hooks/configuration/configuration.constant";
import {
  useEntityConfiguration,
  useUpsertConfigurationMutation,
} from "frontend/hooks/configuration/configuration.store";
import { FormScriptDocumentation } from "frontend/docs/scripts/form-scripts";
import { useState } from "react";
import { DOCUMENTATION_LABEL } from "frontend/docs";
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

const DOCS_TITLE = "Form Scripts";

const CRUD_CONFIG = MAKE_APP_CONFIGURATION_CRUD_CONFIG("entity_form_extension");

export function EntityFormExtensionSettings() {
  const entityFormView = useEntityFormView();
  const [isDocOpen, setIsDocOpen] = useState(false);
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
            action: () => setIsDocOpen(true),
            icon: "help",
            label: DOCUMENTATION_LABEL.CONCEPT(DOCS_TITLE),
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
      <FormScriptDocumentation
        title={DOCS_TITLE}
        close={setIsDocOpen}
        isOpen={isDocOpen}
      />
    </BaseEntitySettingsLayout>
  );
}
