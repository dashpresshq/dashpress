import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import { useEntitySlug } from "frontend/hooks/entity/entity.config";
import {
  useEntityConfiguration,
  useUpsertConfigurationMutation,
} from "frontend/hooks/configuration/configuration.store";
import { useAppConfigurationDomainMessages } from "frontend/hooks/configuration/configuration.constant";
import { PresentationScriptDocumentation } from "frontend/docs/scripts/presentations-scripts";
import { evalJavascriptString } from "shared/lib/script-runner";
import { useDocumentationActionButton } from "frontend/docs/constants";
import { IPresentationScriptParams } from "frontend/views/data/evaluatePresentationScript";
import { useEvaluateScriptContext } from "frontend/hooks/scripts";
import { msg } from "@lingui/macro";
import { fakeMessageDescriptor } from "translations/fake";
import { UserPermissions } from "shared/constants/user";
import { SchemaForm } from "@/components/app/form/schema";
import { ViewStateMachine } from "@/components/app/view-state-machine";
import {
  FormSkeleton,
  FormSkeletonSchema,
} from "@/components/app/skeleton/form";
import { SectionBox } from "@/components/app/section-box";
import { BaseEntitySettingsLayout } from "../_Base";
import { ENTITY_CONFIGURATION_VIEW } from "../constants";
import { useToast } from "@/components/app/toast/use-toast";

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

export function EntityPresentationScriptSettings() {
  const entity = useEntitySlug();
  const entityPresentationScript = useEntityConfiguration(
    "entity_presentation_script",
    entity
  );
  const { toast } = useToast();

  const domainMessages = useAppConfigurationDomainMessages(
    "entity_presentation_script"
  );

  const upsertConfigurationMutation = useUpsertConfigurationMutation(
    "entity_presentation_script",
    entity
  );
  const evaluateScriptContext = useEvaluateScriptContext();

  const documentationActionButton = useDocumentationActionButton(
    domainMessages.TEXT_LANG.TITLE
  );

  useSetPageDetails({
    pageTitle: domainMessages.TEXT_LANG.TITLE,
    viewKey: ENTITY_CONFIGURATION_VIEW,
    permission: UserPermissions.CAN_CONFIGURE_APP,
  });
  return (
    <BaseEntitySettingsLayout>
      <SectionBox
        title={domainMessages.TEXT_LANG.TITLE}
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
                placeholder: fakeMessageDescriptor(placeholder),
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
                toast({
                  variant: "red",
                  title: msg`Could not parse Javascript`,
                  description: msg`•Expression: \n•JS-Error: ${e}`,
                });
              }
            }}
            initialValues={entityPresentationScript.data}
            systemIcon="Save"
            buttonText={domainMessages.FORM_LANG.UPSERT}
          />
        </ViewStateMachine>
      </SectionBox>
      <PresentationScriptDocumentation />
    </BaseEntitySettingsLayout>
  );
}
