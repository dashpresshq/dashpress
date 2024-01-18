import { USER_PERMISSIONS } from "shared/constants/user";
import {
  useEntityFieldLabels,
  useEntityFieldSelections,
  useProcessedEntityFieldTypes,
  useEntityFieldValidations,
  useEntitySlug,
} from "frontend/hooks/entity/entity.config";
import { useEntityFieldLists } from "frontend/hooks/entity/entity.store";
import {
  useEntityConfiguration,
  useUpsertConfigurationMutation,
} from "frontend/hooks/configuration/configuration.store";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { MAKE_APP_CONFIGURATION_CRUD_CONFIG } from "frontend/hooks/configuration/configuration.constant";
import { FieldsSettingsDocumentation } from "frontend/docs/fields";
import { useRouteParam } from "frontend/lib/routing/useRouteParam";
import { useChangeRouterParam } from "frontend/lib/routing/useChangeRouterParam";
import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import {
  FormSkeleton,
  FormSkeletonSchema,
} from "frontend/design-system/components/Skeleton/Form";
import { SectionBox } from "frontend/design-system/components/Section/SectionBox";
import { Tabs } from "frontend/design-system/components/Tabs";
import { useDocumentationActionButton } from "frontend/docs/constants";
import {
  ENTITY_CONFIGURATION_VIEW,
  ENTITY_FIELD_SETTINGS_TAB_LABELS,
} from "../constants";
import { FieldsTypeForm } from "./FieldsType.form";
import { FieldsLabelForm, loadingFieldsLabelForm } from "./FieldsLabel.form";
import { BaseEntitySettingsLayout } from "../_Base";

export function EntityFieldsSettings() {
  const tabFromUrl = useRouteParam("tab");
  const changeTabParam = useChangeRouterParam("tab");

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

  const documentationActionButton =
    useDocumentationActionButton("Fields Settings");

  useSetPageDetails({
    pageTitle: "Field Settings",
    viewKey: ENTITY_CONFIGURATION_VIEW,
    permission: USER_PERMISSIONS.CAN_CONFIGURE_APP,
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
      <SectionBox
        title="Fields Settings"
        actionButtons={[documentationActionButton]}
      >
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
                    crudConfig={MAKE_APP_CONFIGURATION_CRUD_CONFIG(
                      "entity_columns_labels"
                    )}
                    onSubmit={upsertEntityFieldsMapMutation.mutateAsync}
                  />
                </ViewStateMachine>
              ),
              label: ENTITY_FIELD_SETTINGS_TAB_LABELS.LABELS,
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
            },
          ]}
        />
      </SectionBox>
      <FieldsSettingsDocumentation />
    </BaseEntitySettingsLayout>
  );
}
