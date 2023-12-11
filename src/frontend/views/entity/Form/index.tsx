import { SLUG_LOADING_VALUE } from "frontend/lib/routing/constants";
import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import { USER_PERMISSIONS } from "shared/constants/user";
import { MAKE_APP_CONFIGURATION_CRUD_CONFIG } from "frontend/hooks/configuration/configuration.constant";
import {
  useEntityConfiguration,
  useUpsertConfigurationMutation,
} from "frontend/hooks/configuration/configuration.store";
import { FormScriptDocumentation } from "frontend/docs/scripts/form-scripts";
import { useState } from "react";
import { DOCUMENTATION_LABEL } from "frontend/docs";
import { SectionBox } from "frontend/design-system/components/Section/SectionBox";
import { Tabs } from "frontend/design-system/components/Tabs";
import { useEntitySlug } from "frontend/hooks/entity/entity.config";
import { Typo } from "frontend/design-system/primitives/Typo";
import { Spacer } from "frontend/design-system/primitives/Spacer";
import { BaseEntitySettingsLayout } from "../_Base";
import { ENTITY_CONFIGURATION_VIEW } from "../constants";
import { ScriptForm } from "./ScriptForm";
import { IEntityFormExtension } from "./types";

function useEntityFormView() {
  const entity = useEntitySlug();

  const entityFormExtensionSettings = useEntityConfiguration(
    "entity_form_extension",
    entity
  );

  const upsertEntityFormExtensionSettingsMutation =
    useUpsertConfigurationMutation("entity_form_extension", entity);

  const isLoading =
    entityFormExtensionSettings.isLoading || entity === SLUG_LOADING_VALUE;

  const { error } = entityFormExtensionSettings;

  const onScriptSubmit =
    (key: keyof IEntityFormExtension) => async (value: string) => {
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
        configurationKey="entity_form_extension"
        placeholder={`return {
  canRegister: {
    disabled: $.formValues.age < 18
  },
  accountBalance: {
    hidden: JSON.parse($.auth.systemProfile).userId === $.routeParams.entityId
  },
  someField: {
    disabled: someDisabledLogic,
    hidden: someHiddenLogic,
  },
}
        `}
      />
    ),
    "Before Submit": (
      <ScriptForm
        value={entityFormExtensionSettings.data?.beforeSubmit}
        isLoading={isLoading}
        field="beforeSubmit"
        onSubmit={onScriptSubmit("beforeSubmit")}
        error={error}
        configurationKey="entity_form_extension"
        placeholder={`if($.formValues.planet != "Earth") {
  return "Only Aliens can submit this form"
}

return {
  ...$.formValues,
  slug: $.formValues.title.replaceAll(" ", "-").toLowerCase(),
  createdById: JSON.parse($.auth.systemProfile).userId,
  createdAt: new Date(),
}
      `}
      />
    ),
    "Initial Values": (
      <ScriptForm
        value={entityFormExtensionSettings.data?.initialValues}
        isLoading={isLoading}
        field="initialValues"
        configurationKey="entity_form_extension"
        onSubmit={onScriptSubmit("initialValues")}
        error={error}
        placeholder={`return {
  price: 1000,
  status: "new",
  country: "US",
  isApproved: true
}`}
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
          contents={Object.entries(entityFormView).map(([key, value]) => ({
            label: key,
            content: (
              <>
                <Typo.SM textStyle="italic">
                  Click the &apos;Explain Form Scripts&apos; at the top right
                  corner for more info on how this works
                </Typo.SM>
                <Spacer />
                {value}
              </>
            ),
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
