import { Tabs, SectionBox, Text, Spacer } from "@hadmean/chromista";
import { SLUG_LOADING_VALUE } from "@hadmean/protozoa";
import { useSetPageDetails } from "frontend/lib/routing";
import { USER_PERMISSIONS } from "shared/types";
import { IFormExtension } from "frontend/lib/form/types";
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

  const sharedLoading =
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
      <>
        <Text size="5">
          Here you modify the behaviour of the form LINK_TO_DOC
        </Text>
        <Spacer />
        <ScriptForm
          value={entityFormExtensionSettings.data?.fieldsState}
          isLoading={sharedLoading}
          onSubmit={onScriptSubmit("fieldsState")}
          error={error}
        />
      </>
    ),
    "Before Submit": (
      <>
        <Text size="5">
          Here, you get to modify your form just before submit so that you add
          or remove fields based on requirement LINK_TO_DOC
        </Text>
        <Spacer />
        <ScriptForm
          value={entityFormExtensionSettings.data?.beforeSubmit}
          isLoading={sharedLoading}
          onSubmit={onScriptSubmit("beforeSubmit")}
          error={error}
        />
      </>
    ),
    "After Submit": (
      <>
        <Text size="5">
          Here, you get to run any action just after the action is submitted
          LINK_TO_DOC
        </Text>
        <Spacer />
        <ScriptForm
          value={entityFormExtensionSettings.data?.afterSubmit}
          isLoading={sharedLoading}
          onSubmit={onScriptSubmit("afterSubmit")}
          error={error}
        />
      </>
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
      <SectionBox title="Form Settings">
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
