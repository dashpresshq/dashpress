import { ErrorAlert, SectionBox, Tabs } from "@gothicgeeks/design-system";
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
                  <FieldsLabelForm
                    initialValues={entityFieldLabelsMap.data}
                    fields={entityScalarFields.data || []}
                    onSubmit={upsertEntityFieldsMapMutation.mutateAsync}
                  />
                ),
                label: "Labels",
              },
              {
                content: (
                  // A message here that
                  // It is un-evitable that this will be touched but try to have a good schema to try to not touch here as much as possible
                  <FieldsTypeForm
                    initialValues={entityFieldTypes}
                    fields={entityScalarFields.data || []}
                    onSubmit={upsertEntityTypesMapMutation.mutateAsync}
                    getEntityFieldLabels={getEntityFieldLabels}
                  />
                ),
                label: "Types",
              },
              {
                content: (
                  <FieldsLabelForm
                    initialValues={entityFieldLabelsMap.data}
                    fields={entityScalarFields.data || []}
                    onSubmit={upsertEntityFieldsMapMutation.mutateAsync}
                  />
                ),
                label: "Validations",
              },
            ]}
          />
        )}
      </SectionBox>
    </BaseEntitySettingsLayout>
  );
};
