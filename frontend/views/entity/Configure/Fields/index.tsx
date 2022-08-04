import {
  ErrorAlert,
  SectionBox,
  SortList,
  Spacer,
  Tabs,
  Text,
} from "@gothicgeeks/design-system";
import { SLUG_LOADING_VALUE, useRouteParam } from "@gothicgeeks/shared";
import { useSetPageTitle, useChangeRouterParam } from "frontend/lib/routing";
import {
  useEntityFieldLabels,
  useEntityFieldSelections,
  useEntityFieldTypes,
  useEntityFieldValidations,
  useEntitySlug,
} from "../../../../hooks/entity/entity.config";
import { BaseEntitySettingsLayout } from "../_Base";
import {
  ENTITY_FIELDS_ENDPOINT,
  useEntityFieldLists,
} from "../../../../hooks/entity/entity.store";
import {
  useEntityConfiguration,
  useUpsertConfigurationMutation,
} from "../../../../hooks/configuration/configration.store";
import { FieldsLabelForm } from "./FieldsLabel.form";
import { FieldsTypeForm } from "./FieldsType.form";
import {
  ENTITY_CONFIGURATION_VIEW,
  ENTITY_FIELD_SETTINGS_TAB_LABELS,
} from "../constants";

export function EntityFieldsSettings() {
  const tabFromUrl = useRouteParam("tab");
  const changeTabParam = useChangeRouterParam("tab");

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

  const entityFieldTypes = useEntityFieldTypes();
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

  useSetPageTitle("Field Settings", ENTITY_CONFIGURATION_VIEW);

  const sharedLoadingState =
    entityFieldLists.isLoading ||
    entity === SLUG_LOADING_VALUE ||
    entityFieldLabelsMap.isLoading ||
    entityValidationsMapIsLoading ||
    entityFieldTypesMapIsLoading;

  return (
    <BaseEntitySettingsLayout>
      <ErrorAlert
        message={
          entityFieldLists.error ||
          entityFieldLabelsMap.error ||
          entityValidationsMapError ||
          entityFieldTypesMapError
        }
      />
      <SectionBox title="Fields Settings">
        <Tabs
          currentTab={tabFromUrl}
          onChange={changeTabParam}
          contents={[
            {
              content: (
                <>
                  <Text size="5">
                    You get the customize the labels, for the field, Say you
                    want `updatedAt` to be called `Last Updated`. Here is where
                    you that
                  </Text>
                  <Spacer />
                  <FieldsLabelForm
                    isLoading={sharedLoadingState}
                    initialValues={entityFieldLabelsMap.data}
                    fields={entityFieldLists.data || []}
                    onSubmit={async (data) => {
                      await upsertEntityFieldsMapMutation.mutateAsync(
                        data as Record<string, string>
                      );
                    }}
                  />
                </>
              ),
              label: ENTITY_FIELD_SETTINGS_TAB_LABELS.LABELS,
            },
            {
              content: (
                // A message here that
                // It is un-evitable that this will be touched but try to have a
                // good schema to try to not touch here as much as possible
                <>
                  <Text size="5">
                    You get the superpowers to tell us the specific type of the
                    fields, Say the type is `email` or `url` or `textarea` as
                    oppose to just `text` Here is where you get to do that
                  </Text>
                  <Spacer />

                  <FieldsTypeForm
                    isLoading={sharedLoadingState}
                    initialValues={{
                      types: entityFieldTypes,
                      selections: entityFieldSelections,
                      validations: entityFieldValidations,
                      validationsChanged: false,
                      selectionsChanged: false,
                      typesChanged: false,
                    }}
                    fields={entityFieldLists.data || []}
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
                </>
              ),
              label: ENTITY_FIELD_SETTINGS_TAB_LABELS.TYPES,
            },
            {
              content: (
                <>
                  <Text size="5">
                    For some reasons, `createdAt` is showing before `userName`.
                    This is where you correct that wrong :wink
                  </Text>
                  <Spacer size="xl" />
                  <SortList
                    data={{
                      ...entityFieldLists,
                      data: (entityFieldLists.data || []).map((name) => ({
                        value: name,
                        label: getEntityFieldLabels(name),
                      })),
                    }}
                    onSave={async (data) => {
                      await upsertEntityColumnsOrderMutation.mutateAsync(data);
                    }}
                  />
                </>
              ),
              label: ENTITY_FIELD_SETTINGS_TAB_LABELS.ORDER,
            },
          ]}
        />
      </SectionBox>
    </BaseEntitySettingsLayout>
  );
}
