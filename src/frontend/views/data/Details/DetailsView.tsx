import { BaseSkeleton, Spacer, Text } from "@hadmean/chromista";
import { SLUG_LOADING_VALUE } from "@hadmean/protozoa";
import React, { Fragment } from "react";
import { useAppConfiguration } from "frontend/hooks/configuration/configuration.store";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import {
  useEntityFieldLabels,
  useEntityFieldSelections,
  useEntityFieldTypes,
  useSelectedEntityColumns,
} from "../../../hooks/entity/entity.config";
import { useEntityDataDetails } from "../../../hooks/data/data.store";
import {
  useEntityFields,
  useEntityToOneReferenceFields,
} from "../../../hooks/entity/entity.store";
import { fitlerOutHiddenScalarColumns } from "../utils";
import { useEntityViewStateMachine } from "../useEntityViewStateMachine";
import { viewSpecialDataTypes } from "../viewSpecialDataTypes";

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
  const entityFieldTypes = useEntityFieldTypes(entity);
  const hiddenDetailsColumns = useSelectedEntityColumns(
    "hidden_entity_details_columns",
    entity
  );
  const defaultDateFormat = useAppConfiguration<string>("default_date_format");
  const getEntityFieldLabels = useEntityFieldLabels(entity);
  const entityToOneReferenceFields = useEntityToOneReferenceFields(entity);
  const entityFieldSelections = useEntityFieldSelections(entity);

  const error =
    dataDetails.error ||
    hiddenDetailsColumns.error ||
    entityFieldTypes.error ||
    defaultDateFormat.error ||
    entityFields.error ||
    entityToOneReferenceFields.error;

  const isLoading =
    dataDetails.isLoading ||
    defaultDateFormat.isLoading ||
    entityToOneReferenceFields.isLoading ||
    entity === SLUG_LOADING_VALUE ||
    entityFields.isLoading ||
    hiddenDetailsColumns.isLoading;

  const viewState = useEntityViewStateMachine(
    isLoading,
    error,
    "details",
    entity
  );

  if (!id) {
    return null;
  }

  return (
    <ViewStateMachine
      loading={viewState.type === "loading"}
      error={viewState.type === "error" ? viewState.message : undefined}
      loader={
        <>
          {Array.from({ length: 7 }, (_, k) => k).map((key) => (
            <Fragment key={key}>
              <BaseSkeleton height="18px" width="100px" bottom={8} />
              <BaseSkeleton height="20px" bottom={16} />
            </Fragment>
          ))}
        </>
      }
    >
      <>
        {fitlerOutHiddenScalarColumns(
          entityFields.data,
          hiddenDetailsColumns.data
        ).map(({ name }) => {
          const value = dataDetails?.data?.[name];

          const specialDataTypeRender = viewSpecialDataTypes(
            name,
            value,
            entityToOneReferenceFields.data || {},
            entityFieldSelections,
            entityFieldTypes,
            {
              displayFrom,
              defaultDateFormat: defaultDateFormat.data,
            }
          );

          const contentToRender = specialDataTypeRender || <Text>{value}</Text>;

          return (
            <React.Fragment key={name}>
              <Text size="6" weight="bold">
                {getEntityFieldLabels(name)}
              </Text>
              {contentToRender}
              <Spacer />
            </React.Fragment>
          );
        })}
      </>
    </ViewStateMachine>
  );
}
