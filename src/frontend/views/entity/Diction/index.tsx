import { SectionBox } from "frontend/design-system/components/Section/SectionBox";
import {
  FormSkeleton,
  FormSkeletonSchema,
} from "frontend/design-system/components/Skeleton/Form";
import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { USER_PERMISSIONS } from "shared/constants/user";
import {
  useEntityDiction,
  useEntitySlug,
} from "frontend/hooks/entity/entity.config";
import { useUpsertConfigurationMutation } from "frontend/hooks/configuration/configuration.store";
import { MAKE_APP_CONFIGURATION_CRUD_CONFIG } from "frontend/hooks/configuration/configuration.constant";
import { useState } from "react";
import { DictionDocumentation } from "frontend/docs/diction";
import { DOCUMENTATION_LABEL } from "frontend/docs";
import { NAVIGATION_MENU_ENDPOINT } from "frontend/_layouts/app/LayoutImpl/constants";
import { SchemaForm } from "frontend/components/SchemaForm";
import { AppConfigurationValueType } from "shared/configurations/constants";
import { BaseEntitySettingsLayout } from "../_Base";
import { ENTITY_CONFIGURATION_VIEW } from "../constants";

const ENTITY_DICTION_SETTINGS_CRUD_CONFIG =
  MAKE_APP_CONFIGURATION_CRUD_CONFIG("entity_diction");

const DOCS_TITLE = "Diction Settings";

export function EntityDictionSettings() {
  const entity = useEntitySlug();
  const entityDiction = useEntityDiction(entity);
  const upsertConfigurationMutation = useUpsertConfigurationMutation(
    "entity_diction",
    entity,
    {
      otherEndpoints: [NAVIGATION_MENU_ENDPOINT],
    }
  );

  const [isDocOpen, setIsDocOpen] = useState(false);

  useSetPageDetails({
    pageTitle: ENTITY_DICTION_SETTINGS_CRUD_CONFIG.TEXT_LANG.TITLE,
    viewKey: ENTITY_CONFIGURATION_VIEW,
    permission: USER_PERMISSIONS.CAN_CONFIGURE_APP,
  });
  return (
    <BaseEntitySettingsLayout>
      <SectionBox
        title={ENTITY_DICTION_SETTINGS_CRUD_CONFIG.TEXT_LANG.TITLE}
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
          loading={false}
          error={false}
          loader={
            <FormSkeleton
              schema={[FormSkeletonSchema.Input, FormSkeletonSchema.Input]}
            />
          }
        >
          <SchemaForm<AppConfigurationValueType<"entity_diction">>
            onSubmit={upsertConfigurationMutation.mutateAsync}
            initialValues={entityDiction}
            icon="save"
            buttonText={
              MAKE_APP_CONFIGURATION_CRUD_CONFIG("entity_diction").FORM_LANG
                .UPSERT
            }
            fields={{
              plural: {
                type: "text",
                validations: [
                  {
                    validationType: "required",
                  },
                  {
                    validationType: "maxLength",
                    constraint: {
                      length: 32,
                    },
                  },
                ],
              },
              singular: {
                type: "text",
                validations: [
                  {
                    validationType: "required",
                  },
                  {
                    validationType: "maxLength",
                    constraint: {
                      length: 32,
                    },
                  },
                ],
              },
            }}
          />
        </ViewStateMachine>
      </SectionBox>
      <DictionDocumentation
        title={DOCS_TITLE}
        close={setIsDocOpen}
        isOpen={isDocOpen}
      />
    </BaseEntitySettingsLayout>
  );
}
