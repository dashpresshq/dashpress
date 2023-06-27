import { USER_PERMISSIONS } from "shared/constants/user";
import {
  useEntityFieldLabels,
  useEntityFieldSelections,
  useProcessedEntityFieldTypes,
  useEntityFieldValidations,
  useEntitySlug,
} from "frontend/hooks/entity/entity.config";
import { SLUG_LOADING_VALUE } from "frontend/lib/routing/constants";
import {
  ENTITY_FIELDS_ENDPOINT,
  useEntityFieldLists,
} from "frontend/hooks/entity/entity.store";
import {
  useEntityConfiguration,
  useUpsertConfigurationMutation,
} from "frontend/hooks/configuration/configuration.store";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { MAKE_APP_CONFIGURATION_CRUD_CONFIG } from "frontend/hooks/configuration/configuration.constant";
import { FieldsSettingsDocumentation } from "frontend/docs/fields";
import { useState } from "react";
import { DOCUMENTATION_LABEL } from "frontend/docs";
import { useRouteParam } from "frontend/lib/routing/useRouteParam";
import { useChangeRouterParam } from "frontend/lib/routing/useChangeRouterParam";
import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import {
  FormSkeleton,
  FormSkeletonSchema,
} from "frontend/design-system/components/Skeleton/Form";
import { ListSkeleton } from "frontend/design-system/components/Skeleton/List";
import { SortList } from "frontend/design-system/components/SortList";
import { SectionBox } from "frontend/design-system/components/Section/SectionBox";
import { Tabs } from "frontend/design-system/components/Tabs";
import {
  ENTITY_CONFIGURATION_VIEW,
  ENTITY_FIELD_SETTINGS_TAB_LABELS,
} from "../constants";
import { FieldsTypeForm } from "./FieldsType.form";
import { FieldsLabelForm, loadingFieldsLabelForm } from "./FieldsLabel.form";
import { BaseEntitySettingsLayout } from "../_Base";

const DOCS_TITLE = "Fields Settings";

export function EntityFieldsSettings() {
  const tabFromUrl = useRouteParam("tab");
  const changeTabParam = useChangeRouterParam("tab");
  const [isDocOpen, setIsDocOpen] = useState(false);

  const entity = useEntitySlug();
  const entityFieldLists = useEntityFieldLists(entity);
  const entityFieldLabelsMap = useEntityConfiguration<Record<string, string>>(
    "entity_columns_labels",
    entity
  );

  const getEntityFieldLabels = useEntityFieldLabels();
  const {
    isLoading: entityFieldTypesMapIsLoading,
    error: entityFieldTypesMapError,
  } = useEntityConfiguration<Record<string, string>>(
    "entity_columns_types",
    entity
  );

  const {
    isLoading: entityValidationsMapIsLoading,
    error: entityValidationsMapError,
  } = useEntityConfiguration<Record<string, string>>(
    "entity_validations",
    entity
  );

  const entityFieldTypes = useProcessedEntityFieldTypes();
  const entityFieldValidations = useEntityFieldValidations();
  const entityFieldSelections = useEntityFieldSelections();

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

  const upsertEntityColumnsOrderMutation = useUpsertConfigurationMutation(
    "entity_fields_orders",
    entity,
    {
      otherEndpoints: [ENTITY_FIELDS_ENDPOINT(entity)],
    }
  );

  useSetPageDetails({
    pageTitle: "Field Settings",
    viewKey: ENTITY_CONFIGURATION_VIEW,
    permission: USER_PERMISSIONS.CAN_CONFIGURE_APP,
  });

  const sharedLoadingState =
    entityFieldLists.isLoading ||
    entity === SLUG_LOADING_VALUE ||
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
        iconButtons={[
          {
            action: () => setIsDocOpen(true),
            icon: "help",
            label: DOCUMENTATION_LABEL.CONCEPT(DOCS_TITLE),
          },
        ]}
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
                    onSubmit={async (data) => {
                      await upsertEntityFieldsMapMutation.mutateAsync(
                        data as Record<string, string>
                      );
                    }}
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
              label: ENTITY_FIELD_SETTINGS_TAB_LABELS.TYPES,
            },
            {
              content: (
                <ViewStateMachine
                  loader={<ListSkeleton count={10} />}
                  loading={sharedLoadingState}
                  error={error}
                >
                  <SortList
                    data={{
                      ...entityFieldLists,
                      data: entityFieldLists.data.map((name) => ({
                        value: name,
                        label: getEntityFieldLabels(name),
                      })),
                    }}
                    onSave={
                      upsertEntityColumnsOrderMutation.mutateAsync as (
                        data: string[]
                      ) => Promise<void>
                    }
                  />
                </ViewStateMachine>
              ),
              label: ENTITY_FIELD_SETTINGS_TAB_LABELS.ORDER,
            },
          ]}
        />
      </SectionBox>
      <FieldsSettingsDocumentation
        title={DOCS_TITLE}
        close={setIsDocOpen}
        isOpen={isDocOpen}
      />
    </BaseEntitySettingsLayout>
  );
}
