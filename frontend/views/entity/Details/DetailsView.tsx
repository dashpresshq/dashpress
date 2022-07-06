import {
  ComponentIsLoading,
  ErrorAlert,
  Spacer,
  Text,
} from "@gothicgeeks/design-system";
import {
  useEntityFieldLabels,
  useEntityFieldSelections,
  useSelectedEntityColumns,
} from "../../../hooks/entity/entity.config";
import { useEntityDataDetails } from "../../../hooks/data/data.store";
import {
  useEntityReferenceFields,
  useEntityScalarFields,
} from "../../../hooks/entity/entity.store";
import { fitlerOutHiddenScalarColumns } from "../utils";
import { OptionTag } from "../OptionTag";
import { ReferenceComponent } from "../Table/ReferenceComponent";

export function EntityDetailsView({
  id,
  entity,
}: {
  id: string;
  entity: string;
}) {
  const dataDetails = useEntityDataDetails(entity, id);
  const entityScalarFields = useEntityScalarFields(entity);
  const hiddenDetailsColumns = useSelectedEntityColumns(
    "hidden_entity_details_columns",
    entity
  );
  const getEntityFieldLabels = useEntityFieldLabels(entity);
  const entityReferenceFields = useEntityReferenceFields(entity);
  const entityFieldSelections = useEntityFieldSelections(entity);

  const error =
    dataDetails.error ||
    hiddenDetailsColumns.error ||
    entityScalarFields.error ||
    entityReferenceFields.error;

  const isLoading =
    dataDetails.isLoading ||
    entityReferenceFields.isLoading ||
    entityScalarFields.isLoading ||
    hiddenDetailsColumns.isLoading;

  if (!id) {
    return null;
  }

  return (
    <>
      {isLoading && <ComponentIsLoading />}
      {error && <ErrorAlert message={error} />}
      {!isLoading && !error && (
        <>
          {/* TODO use a breadcrumb here for the deep entities */}
          {fitlerOutHiddenScalarColumns(
            entityScalarFields,
            hiddenDetailsColumns
          ).map(({ name }) => {
            const value = dataDetails?.data?.[name];

            let contentToRender = <Text>{value}</Text>;

            if (entityReferenceFields.data?.[name]) {
              contentToRender = (
                <ReferenceComponent
                  entity={entityReferenceFields.data?.[name]}
                  id={value as string}
                />
              );
            } else if (entityFieldSelections[name]) {
              const availableOption = entityFieldSelections[name].find(
                (option) => option.value === value
              );
              if (availableOption) {
                contentToRender = (
                  <OptionTag
                    color={availableOption.color}
                    label={availableOption.label}
                    value={availableOption.value}
                  />
                );
              }
            }

            return (
              <>
                <Text size="5" weight="bold">
                  {getEntityFieldLabels(name)}
                </Text>
                {contentToRender}
                <Spacer />
              </>
            );
          })}
        </>
      )}
    </>
  );
}
