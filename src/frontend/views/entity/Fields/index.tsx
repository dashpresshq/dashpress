import { msg } from "@lingui/macro";
import { useDocumentationActionButton } from "frontend/docs/constants";
import { FieldsSettingsDocumentation } from "frontend/docs/fields";
import { useAppConfigurationDomainMessages } from "frontend/hooks/configuration/configuration.constant";
import {
  useEntityConfiguration,
  useUpsertConfigurationMutation,
} from "frontend/hooks/configuration/configuration.store";
import {
  useEntityFieldLabels,
  useEntityFieldSelections,
  useEntityFieldValidations,
  useEntitySlug,
  useProcessedEntityFieldTypes,
} from "frontend/hooks/entity/entity.config";
import { useEntityFieldLists } from "frontend/hooks/entity/entity.store";
import { useChangeRouterParam } from "frontend/lib/routing/useChangeRouterParam";
import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import { useRouteParam } from "frontend/lib/routing/useRouteParam";
import { UserPermissions } from "shared/constants/user";

import { SectionBox } from "@/components/app/section-box";
import {
  FormSkeleton,
  FormSkeletonSchema,
} from "@/components/app/skeleton/form";
import { Tabs } from "@/components/app/tabs";
import { ViewStateMachine } from "@/components/app/view-state-machine";

import { BaseEntitySettingsLayout } from "../_Base";
import {
  ENTITY_CONFIGURATION_VIEW,
  ENTITY_FIELD_SETTINGS_TAB_LABELS,
} from "../constants";
import { FieldsLabelForm, loadingFieldsLabelForm } from "./FieldsLabel.form";
import { FieldsTypeForm } from "./FieldsType.form";

const TITLE_MSG = msg`Field Settings`;

export function EntityFieldsSettings() {
  const tabFromUrl = useRouteParam("tab");
  const changeTabParam = useChangeRouterParam("tab");
  const domainMessages = useAppConfigurationDomainMessages(
    "entity_columns_labels"
  );

  const entity = useEntitySlug();
  const entityFieldLists = useEntityFieldLists(entity);
  const entityFieldLabelsMap = useEntityConfiguration(
    "entity_columns_labels",
    entity
  );

  const getEntityFieldLabels = useEntityFieldLabels(entity);
  const {
    isLoading: entityFieldTypesMapIsLoading,
    error: entityFieldTypesMapError,
  } = useEntityConfiguration("entity_columns_types", entity);

  const {
    isLoading: entityValidationsMapIsLoading,
    error: entityValidationsMapError,
  } = useEntityConfiguration("entity_validations", entity);

  const entityFieldTypes = useProcessedEntityFieldTypes(entity);
  const entityFieldValidations = useEntityFieldValidations(entity);
  const entityFieldSelections = useEntityFieldSelections(entity);

  const upsertEntityFieldsMapMutation = useUpsertConfigurationMutation(
    "entity_columns_labels",
    entity
  );

  const upsertEntityTypesMapMutation = useUpsertConfigurationMutation(
    "entity_columns_types",
    entity
  );

  const upsertEntityValidationsMutation = useUpsertConfigurationMutation(
    "entity_validations",
    entity
  );

  const upsertEntitySelectionsMutation = useUpsertConfigurationMutation(
    "entity_selections",
    entity
  );

  const documentationActionButton = useDocumentationActionButton(TITLE_MSG);

  useSetPageDetails({
    pageTitle: TITLE_MSG,
    viewKey: ENTITY_CONFIGURATION_VIEW,
    permission: UserPermissions.CAN_CONFIGURE_APP,
  });

  const sharedLoadingState =
    entityFieldLists.isLoading ||
    entityFieldLabelsMap.isLoading ||
    entityValidationsMapIsLoading ||
    entityFieldTypesMapIsLoading;

  const error =
    entityFieldLists.error ||
    entityFieldLabelsMap.error ||
    entityValidationsMapError ||
    entityFieldTypesMapError;

  return (
    <BaseEntitySettingsLayout>
      <SectionBox title={TITLE_MSG} actionButtons={[documentationActionButton]}>
        <Tabs
          currentTab={tabFromUrl}
          onChange={changeTabParam}
          contents={[
            {
              content: (
                <ViewStateMachine
                  loader={loadingFieldsLabelForm}
                  loading={sharedLoadingState}
                  error={error}
                >
                  <FieldsLabelForm
                    initialValues={entityFieldLabelsMap.data}
                    fields={entityFieldLists.data}
                    crudConfig={domainMessages}
                    onSubmit={upsertEntityFieldsMapMutation.mutateAsync}
                  />
                </ViewStateMachine>
              ),
              label: ENTITY_FIELD_SETTINGS_TAB_LABELS.LABELS,
              id: `labels`,
            },
            {
              content: (
                <ViewStateMachine
                  loader={
                    <FormSkeleton
                      schema={[
                        FormSkeletonSchema.Input,
                        FormSkeletonSchema.Input,
                        FormSkeletonSchema.Input,
                        FormSkeletonSchema.Textarea,
                      ]}
                    />
                  }
                  loading={sharedLoadingState}
                  error={error}
                >
                  <FieldsTypeForm
                    initialValues={{
                      types: entityFieldTypes,
                      selections: entityFieldSelections,
                      validations: entityFieldValidations,
                      validationsChanged: false,
                      selectionsChanged: false,
                      typesChanged: false,
                    }}
                    fields={entityFieldLists.data}
                    onSubmit={async (data) => {
                      if (data.typesChanged) {
                        await upsertEntityTypesMapMutation.mutateAsync(
                          data.types
                        );
                      }
                      if (data.validationsChanged) {
                        await upsertEntityValidationsMutation.mutateAsync(
                          data.validations
                        );
                      }
                      if (data.selectionsChanged) {
                        await upsertEntitySelectionsMutation.mutateAsync(
                          data.selections || {}
                        );
                      }
                    }}
                    getEntityFieldLabels={getEntityFieldLabels}
                  />
                </ViewStateMachine>
              ),
              label: ENTITY_FIELD_SETTINGS_TAB_LABELS.FORM,
              id: `form`,
            },
          ]}
        />
      </SectionBox>
      <FieldsSettingsDocumentation />
    </BaseEntitySettingsLayout>
  );
}
