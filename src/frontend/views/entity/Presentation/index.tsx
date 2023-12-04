import { SectionBox } from "frontend/design-system/components/Section/SectionBox";
import {
  FormSkeleton,
  FormSkeletonSchema,
} from "frontend/design-system/components/Skeleton/Form";
import { SLUG_LOADING_VALUE } from "frontend/lib/routing/constants";
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
import { BaseEntitySettingsLayout } from "../_Base";
import { PresentationScriptForm } from "./Form";
import { ENTITY_CONFIGURATION_VIEW } from "../constants";

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
        iconButtons={[
          {
            action: () => setIsDocOpen(true),
            icon: "help",
            label: DOCUMENTATION_LABEL.CONCEPT(DOCS_TITLE),
          },
        ]}
      >
        <ViewStateMachine
          loading={
            entity === SLUG_LOADING_VALUE || entityPresentationScript.isLoading
          }
          error={entityPresentationScript.error}
          loader={<FormSkeleton schema={[FormSkeletonSchema.RichTextArea]} />}
        >
          <PresentationScriptForm
            onSubmit={upsertConfigurationMutation.mutateAsync}
            initialValues={entityPresentationScript.data}
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
