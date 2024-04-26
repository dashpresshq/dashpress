import { SectionBox } from "frontend/design-system/components/Section/SectionBox";
import {
  FormSkeleton,
  FormSkeletonSchema,
} from "frontend/design-system/components/Skeleton/Form";
import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { USER_PERMISSIONS } from "shared/constants/user";
import { useEntitySlug } from "frontend/hooks/entity/entity.config";
import {
  useEntityConfiguration,
  useUpsertConfigurationMutation,
} from "frontend/hooks/configuration/configuration.store";
import { MAKE_APP_CONFIGURATION_CRUD_CONFIG } from "frontend/hooks/configuration/configuration.constant";
import { PresentationScriptDocumentation } from "frontend/docs/scripts/presentations-scripts";
import { ToastService } from "frontend/lib/toast";
import { evalJavascriptString } from "shared/lib/script-runner";
import { SchemaForm } from "frontend/components/SchemaForm";
import { useDocumentationActionButton } from "frontend/docs/constants";
import { IPresentationScriptParams } from "frontend/views/data/evaluatePresentationScript";
import { useEvaluateScriptContext } from "frontend/hooks/scripts";
import { msg } from "@lingui/macro";
import { i18nNoop } from "shared/lib/noop";
import { BaseEntitySettingsLayout } from "../_Base";
import { ENTITY_CONFIGURATION_VIEW } from "../constants";

const placeholder = `if($.field === "image"){
  return "https://cdn.mycompany.com/" + $.value + "?size=320x640";
}

if($.field === "description" && $.from === "table"){
  return $.value.substr(0, 120)
}

if($.field === "commentsCount"){
  return ($.value / 1000) + "K"
}
          `;

type IEntityPresentationScript = {
  script: string;
};

const PRESENTATION_SCRIPT_CRUD_CONFIG = MAKE_APP_CONFIGURATION_CRUD_CONFIG(
  "entity_presentation_script"
);

export function EntityPresentationScriptSettings() {
  const entity = useEntitySlug();
  const entityPresentationScript = useEntityConfiguration(
    "entity_presentation_script",
    entity
  );
  const upsertConfigurationMutation = useUpsertConfigurationMutation(
    "entity_presentation_script",
    entity
  );
  const evaluateScriptContext = useEvaluateScriptContext();

  const documentationActionButton = useDocumentationActionButton(
    PRESENTATION_SCRIPT_CRUD_CONFIG.TEXT_LANG.TITLE
  );

  useSetPageDetails({
    pageTitle: PRESENTATION_SCRIPT_CRUD_CONFIG.TEXT_LANG.TITLE,
    viewKey: ENTITY_CONFIGURATION_VIEW,
    permission: USER_PERMISSIONS.CAN_CONFIGURE_APP,
  });
  return (
    <BaseEntitySettingsLayout>
      <SectionBox
        title={PRESENTATION_SCRIPT_CRUD_CONFIG.TEXT_LANG.TITLE}
        actionButtons={[documentationActionButton]}
      >
        <ViewStateMachine
          loading={entityPresentationScript.isLoading}
          error={entityPresentationScript.error}
          loader={<FormSkeleton schema={[FormSkeletonSchema.RichTextArea]} />}
        >
          <SchemaForm<IEntityPresentationScript>
            fields={{
              script: {
                type: "json",
                label: msg`Script`,
                validations: [],
                placeholder: msg`${i18nNoop(placeholder)}`,
              },
            }}
            onSubmit={async (data) => {
              const context: IPresentationScriptParams = {
                field: "test",
                from: "details",
                row: {},
                value: "",
                ...evaluateScriptContext,
              };
              try {
                evalJavascriptString(data.script, context);

                await upsertConfigurationMutation.mutateAsync(data);
              } catch (e) {
                ToastService.error(`•Expression: \n•JS-Error: ${e}`);
              }
            }}
            initialValues={entityPresentationScript.data}
            systemIcon="Save"
            buttonText={
              MAKE_APP_CONFIGURATION_CRUD_CONFIG("entity_presentation_script")
                .FORM_LANG.UPSERT
            }
          />
        </ViewStateMachine>
      </SectionBox>
      <PresentationScriptDocumentation />
    </BaseEntitySettingsLayout>
  );
}
