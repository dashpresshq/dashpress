import {
  ErrorAlert,
  SectionBox,
  Spacer,
  Tabs,
  Text,
} from "@gothicgeeks/design-system";
import {
  useEntityFieldLabels,
  useEntityFieldTypes,
  useEntitySlug,
} from "../../../../hooks/entity/entity.config";
import { NAVIGATION_LINKS } from "../../../../lib/routing/links";
import { BaseEntitySettingsLayout } from ".././_Base";
import { useEntityScalarFields } from "../../../../hooks/entity/entity.store";
import {
  useEntityConfiguration,
  useUpsertConfigurationMutation,
} from "../../../../hooks/configuration/configration.store";
import { FieldsLabelForm } from "./FieldsLabel.form";
import { FieldsTypeForm } from "./FieldsType.form";

export const EntityFieldsSettings = () => {
  const entity = useEntitySlug();
  const entityScalarFields = useEntityScalarFields(entity);
  const entityFieldLabelsMap = useEntityConfiguration<Record<string, string>>(
    "entity_columns_labels",
    entity
  );
  const entityFieldTypesMap = useEntityConfiguration<Record<string, string>>(
    "entity_columns_types",
    entity
  );

  const entityFieldTypes = useEntityFieldTypes();

  const upsertEntityFieldsMapMutation = useUpsertConfigurationMutation(
    "entity_columns_labels",
    entity
  );

  const upsertEntityTypesMapMutation = useUpsertConfigurationMutation(
    "entity_columns_types",
    entity
  );

  const getEntityFieldLabels = useEntityFieldLabels();

  return (
    <BaseEntitySettingsLayout
      menuItem={{
        link: NAVIGATION_LINKS.ENTITY.CONFIG.FIELDS(entity),
        name: "Fields Settings",
      }}
    >
      <ErrorAlert
        message={
          entityScalarFields.error ||
          entityFieldLabelsMap.error ||
          entityFieldTypesMap.error
        }
      />
      <SectionBox title="Fields Settings">
        {entityScalarFields.isLoading ||
        entityFieldLabelsMap.isLoading ||
        entityFieldTypesMap.isLoading ? (
          <>Loading...</>
        ) : (
          <Tabs
            // TODO add default tab
            contents={[
              {
                content: (
                  <>
                    <Text size="5">
                      You get the customize the labels, for the field, Say you
                      want `updatedAt` to be called `Last Updated`. Here is
                      where you that
                    </Text>
                    <Spacer />
                    <FieldsLabelForm
                      initialValues={entityFieldLabelsMap.data}
                      fields={entityScalarFields.data || []}
                      onSubmit={upsertEntityFieldsMapMutation.mutateAsync}
                    />
                  </>
                ),
                label: "Labels",
              },
              {
                content: (
                  // A message here that
                  // It is un-evitable that this will be touched but try to have a good schema to try to not touch here as much as possible
                  <>
                    <Text size="5">
                      You get the superpowers to tell us the specific type of
                      the fields, Say the type is `email` or `url` or `textarea`
                      as oppose to just `text` Here is where you get to do that
                    </Text>
                    <Spacer />

                    <FieldsTypeForm
                      initialValues={entityFieldTypes}
                      fields={entityScalarFields.data || []}
                      onSubmit={upsertEntityTypesMapMutation.mutateAsync}
                      getEntityFieldLabels={getEntityFieldLabels}
                    />
                  </>
                ),
                label: "Types",
              },
              {
                content: (
                  <>
                    <Text size="5">
                      You get the superpowers to tell us the data requirement
                      for the fields, We already try go guess if it is required
                      or the maxLength etc, But here is where you get to dump to
                      all us all the data constraint
                    </Text>
                    <Spacer />

                    <FieldsLabelForm
                      initialValues={entityFieldLabelsMap.data}
                      fields={entityScalarFields.data || []}
                      onSubmit={upsertEntityFieldsMapMutation.mutateAsync}
                    />
                  </>
                ),
                label: "Validations",
              },
              {
                content: (
                  <>
                    <Text size="5">
                      For some reasons, `createdAt` is showing before
                      `userName`. This is where you correct that wrong :wink
                    </Text>
                    <Spacer />
                    <FieldsLabelForm
                      initialValues={entityFieldLabelsMap.data}
                      fields={entityScalarFields.data || []}
                      onSubmit={upsertEntityFieldsMapMutation.mutateAsync}
                    />
                  </>
                ),
                label: "Order",
              },
            ]}
          />
        )}
      </SectionBox>
    </BaseEntitySettingsLayout>
  );
};
