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
import { useState } from "react";
import { DOCUMENTATION_LABEL } from "frontend/docs";
import { PresentationScriptDocumentation } from "frontend/docs/scripts/presentations-scripts";
import { ToastService } from "frontend/lib/toast";
import { evalJavascriptString } from "shared/lib/script-runner";
import { SchemaForm } from "frontend/components/SchemaForm";
import { BaseEntitySettingsLayout } from "../_Base";
import { ENTITY_CONFIGURATION_VIEW } from "../constants";

type IEntityPresentationScript = {
  script: string;
};

const PRESENTATION_SCRIPT_CRUD_CONFIG = MAKE_APP_CONFIGURATION_CRUD_CONFIG(
  "entity_presentation_script"
);

const DOCS_TITLE = "Presentation Script";

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
  const [isDocOpen, setIsDocOpen] = useState(false);

  useSetPageDetails({
    pageTitle: PRESENTATION_SCRIPT_CRUD_CONFIG.TEXT_LANG.TITLE,
    viewKey: ENTITY_CONFIGURATION_VIEW,
    permission: USER_PERMISSIONS.CAN_CONFIGURE_APP,
  });
  return (
    <BaseEntitySettingsLayout>
      <SectionBox
        title={PRESENTATION_SCRIPT_CRUD_CONFIG.TEXT_LANG.TITLE}
        actionButtons={[
          {
            _type: "normal",
            action: () => setIsDocOpen(true),
            icon: "help",
            label: DOCUMENTATION_LABEL.CONCEPT(DOCS_TITLE),
          },
        ]}
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
                label: "Script",
                validations: [],
                placeholder: `if($.field === "image"){
  return "https://cdn.mycompany.com/" + $.value + "?size=320x640";
}

if($.field === "description" && $.from === "table"){
  return $.value.substr(0, 120)
}

if($.field === "commentsCount"){
  return ($.value / 1000) + "K"
}
          `,
              },
            }}
            onSubmit={async (data) => {
              try {
                evalJavascriptString(data.script, {
                  field: "test",
                  from: "details",
                  row: {},
                  value: "",
                });

                await upsertConfigurationMutation.mutateAsync(data);
              } catch (e) {
                ToastService.error(`•Expression: \n•JS-Error: ${e}`);
              }
            }}
            initialValues={entityPresentationScript.data}
            icon="save"
            buttonText={
              MAKE_APP_CONFIGURATION_CRUD_CONFIG("entity_presentation_script")
                .FORM_LANG.UPSERT
            }
          />
        </ViewStateMachine>
      </SectionBox>
      <PresentationScriptDocumentation
        title={DOCS_TITLE}
        close={setIsDocOpen}
        isOpen={isDocOpen}
      />
    </BaseEntitySettingsLayout>
  );
}
