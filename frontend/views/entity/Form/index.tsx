import { Tabs, SectionBox, Text, Spacer } from "@gothicgeeks/design-system";
import { SLUG_LOADING_VALUE } from "@gothicgeeks/shared";
import { useSetPageDetails } from "frontend/lib/routing";
import { USER_PERMISSIONS } from "shared/types";
import { IFormCustomization } from "frontend/lib/form/types";
import { useEntitySlug } from "../../../hooks/entity/entity.config";
import { BaseEntitySettingsLayout } from "../_Base";
import {
  useEntityConfiguration,
  useUpsertConfigurationMutation,
} from "../../../hooks/configuration/configration.store";
import { useEntityFields } from "../../../hooks/entity/entity.store";

import { ENTITY_CONFIGURATION_VIEW } from "../constants";
import { ScriptForm } from "./ScriptForm";

function useEntityCrudView() {
  const entity = useEntitySlug();

  const entityFields = useEntityFields(entity);

  const entityFormSettings = useEntityConfiguration<IFormCustomization>(
    "entity_form_settings",
    entity
  );

  const upsertEntityFormSettingsMutation = useUpsertConfigurationMutation(
    "entity_form_settings",
    entity
  );

  const sharedLoading =
    entityFields.isLoading ||
    entityFormSettings.isLoading ||
    entity === SLUG_LOADING_VALUE;

  const error = entityFields.error || entityFormSettings.error;

  const onScriptSubmit =
    (key: keyof IFormCustomization) => async (value: string) => {
      upsertEntityFormSettingsMutation.mutateAsync({
        ...entityFormSettings.data,
        [key]: value,
      });
    };

  return {
    "Fields State": (
      <>
        <Text size="5">Here you modify the behaviour of the form</Text>
        <Spacer />
        <ScriptForm
          value={entityFormSettings.data?.fieldsState}
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
          or remove fields based on requirement
        </Text>
        <Spacer />
        <ScriptForm
          value={entityFormSettings.data?.beforeSubmit}
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
        </Text>
        <Spacer />
        <ScriptForm
          value={entityFormSettings.data?.afterSubmit}
          isLoading={sharedLoading}
          onSubmit={onScriptSubmit("afterSubmit")}
          error={error}
        />
      </>
    ),
  };
}

export function EntityFormSettings() {
  const entityCrudView = useEntityCrudView();
  useSetPageDetails({
    pageTitle: "Form Settings",
    viewKey: ENTITY_CONFIGURATION_VIEW,
    permission: USER_PERMISSIONS.CAN_CONFIGURE_APP,
  });
  return (
    <BaseEntitySettingsLayout>
      <SectionBox title="Form Settings">
        <Tabs
          contents={Object.entries(entityCrudView).map(([key, value]) => ({
            label: key,
            content: value,
          }))}
        />
      </SectionBox>
    </BaseEntitySettingsLayout>
  );
}
