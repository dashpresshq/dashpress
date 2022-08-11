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
  useEntityFields,
  useEntityToOneReferenceFields,
} from "../../../hooks/entity/entity.store";
import { fitlerOutHiddenScalarColumns } from "../utils";
import { OptionTag } from "../OptionTag";
import { ReferenceComponent } from "../Table/ReferenceComponent";
import { useEntityViewStateMachine } from "../useEntityViewStateMachine";

export function EntityDetailsView({
  id,
  entity,
  displayFrom,
}: {
  id: string;
  entity: string;
  displayFrom: "details" | "canvas";
}) {
  const dataDetails = useEntityDataDetails(entity, id);
  const entityFields = useEntityFields(entity);
  const hiddenDetailsColumns = useSelectedEntityColumns(
    "hidden_entity_details_columns",
    entity
  );
  const getEntityFieldLabels = useEntityFieldLabels(entity);
  const entityToOneReferenceFields = useEntityToOneReferenceFields(entity);
  const entityFieldSelections = useEntityFieldSelections(entity);

  const error =
    dataDetails.error ||
    hiddenDetailsColumns.error ||
    entityFields.error ||
    entityToOneReferenceFields.error;

  const isLoading =
    dataDetails.isLoading ||
    entityToOneReferenceFields.isLoading ||
    entity === SLUG_LOADING_VALUE ||
    entityFields.isLoading ||
    hiddenDetailsColumns.isLoading;

  const viewState = useEntityViewStateMachine(isLoading, error, "details");

  if (!id) {
    return null;
  }

  return (
    <>
      {viewState.type === "loading" && <ComponentIsLoading />}
      {viewState.type === "error" && <ErrorAlert message={viewState.message} />}
      {viewState.type === "render" && (
        <>
          {fitlerOutHiddenScalarColumns(entityFields, hiddenDetailsColumns).map(
            ({ name }) => {
              const value = dataDetails?.data?.[name];

              let contentToRender = <Text>{value}</Text>;

              if (entityToOneReferenceFields.data?.[name]) {
                contentToRender = (
                  <ReferenceComponent
                    entity={entityToOneReferenceFields.data?.[name]}
                    id={value as string}
                    displayFrom={displayFrom}
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
