import { ErrorAlert, SectionBox, Tabs } from "@gothicgeeks/design-system";
import { useEntitySlug } from "../../../../hooks/entity/entity.config";
import { NAVIGATION_LINKS } from "../../../../lib/routing/links";
import { BaseEntitySettingsLayout } from ".././_Base";
import { useEntityScalarFields } from "../../../../hooks/entity/entity.store";
import {
  useEntityConfiguration,
  useUpsertConfigurationMutation,
} from "../../../../hooks/configuration/configration.store";
import { FieldsLabelForm } from "./FieldsLabel.form";

export const EntityFieldsSettings = () => {
  const entity = useEntitySlug();
  const entityScalarFields = useEntityScalarFields(entity);
  const entityFieldLabelsMap = useEntityConfiguration<Record<string, string>>(
    "entity_columns_labels",
    entity
  );

  const upsertEntityFieldsMapMutation = useUpsertConfigurationMutation(
    "entity_columns_labels",
    entity
  );

  return (
    <BaseEntitySettingsLayout
      menuItem={{
        link: NAVIGATION_LINKS.ENTITY.CONFIG.FIELDS(entity),
        name: "Fields Settings",
      }}
    >
      <ErrorAlert
        message={entityScalarFields.error || entityFieldLabelsMap.error}
      />
      <SectionBox title="Fields Settings">
        {entityScalarFields.isLoading || entityFieldLabelsMap.isLoading ? (
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
                  <FieldsLabelForm
                    initialValues={entityFieldLabelsMap.data}
                    fields={entityScalarFields.data || []}
                    onSubmit={upsertEntityFieldsMapMutation.mutateAsync}
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
