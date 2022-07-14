import {
  ComponentIsLoading,
  ErrorAlert,
  Spacer,
  Text,
} from "@gothicgeeks/design-system";
import { SLUG_LOADING_VALUE } from "@gothicgeeks/shared";
import React from "react";
import {
  useEntityFieldLabels,
  useEntityFieldSelections,
  useSelectedEntityColumns,
} from "../../../hooks/entity/entity.config";
import { useEntityDataDetails } from "../../../hooks/data/data.store";
import {
  useEntityReferenceFields,
  useEntityFields,
} from "../../../hooks/entity/entity.store";
import { fitlerOutHiddenScalarColumns } from "../utils";
import { OptionTag } from "../OptionTag";
import { ReferenceComponent } from "../Table/ReferenceComponent";
import { useViewStateMachine } from "../useViewStateMachine";

export function EntityDetailsView({
  id,
  entity,
}: {
  id: string;
  entity: string;
}) {
  const dataDetails = useEntityDataDetails(entity, id);
  const entityFields = useEntityFields(entity);
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
    entityFields.error ||
    entityReferenceFields.error;

  const isLoading =
    dataDetails.isLoading ||
    entityReferenceFields.isLoading ||
    entity === SLUG_LOADING_VALUE ||
    entityFields.isLoading ||
    hiddenDetailsColumns.isLoading;

  const viewState = useViewStateMachine(isLoading, error, "details");

  if (!id) {
    return null;
  }

  return (
    <>
      {viewState.type === "loading" && <ComponentIsLoading />}
      {viewState.type === "error" && <ErrorAlert message={viewState.message} />}
      {viewState.type === "render" && (
        <>
          {/* TODO use a breadcrumb here for the deep entities */}
          {fitlerOutHiddenScalarColumns(entityFields, hiddenDetailsColumns).map(
            ({ name }) => {
              const value = dataDetails?.data?.[name];

              let contentToRender = <Text>{value}</Text>;

              if (entityReferenceFields.data?.toOne[name]) {
                contentToRender = (
                  <ReferenceComponent
                    entity={entityReferenceFields.data?.toOne[name]}
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
                <React.Fragment key={name}>
                  <Text size="5" weight="bold">
                    {getEntityFieldLabels(name)}
                  </Text>
                  {contentToRender}
                  <Spacer />
                </React.Fragment>
              );
            }
          )}
        </>
      )}
    </>
  );
}
