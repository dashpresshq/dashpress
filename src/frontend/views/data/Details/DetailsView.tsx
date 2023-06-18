import { BaseSkeleton, Spacer, Typo } from "@hadmean/chromista";
import { SLUG_LOADING_VALUE } from "@hadmean/protozoa";
import React, { Fragment } from "react";
import {
  useAppConfiguration,
  useEntityConfiguration,
} from "frontend/hooks/configuration/configuration.store";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import {
  useEntityFieldLabels,
  useEntityFieldSelections,
  useProcessedEntityFieldTypes,
  useHiddenEntityColumns,
} from "../../../hooks/entity/entity.config";
import { useEntityDataDetails } from "../../../hooks/data/data.store";
import {
  useEntityFields,
  useEntityToOneReferenceFields,
} from "../../../hooks/entity/entity.store";
import { filterOutHiddenScalarColumns } from "../utils";
import { useEntityViewStateMachine } from "../useEntityViewStateMachine";
import { viewSpecialDataTypes } from "../viewSpecialDataTypes";
import { IEntityPresentationScript } from "../types";
import { evalutePresentationScript } from "../evaluatePresentationScript";

export function EntityDetailsView({
  id,
  entity,
  displayFrom,
  column,
}: {
  id: string;
  entity: string;
  displayFrom: "details" | "canvas";
  column?: string;
}) {
  const dataDetails = useEntityDataDetails(entity, id, column);
  const entityFields = useEntityFields(entity);
  const entityFieldTypes = useProcessedEntityFieldTypes(entity);
  const hiddenDetailsColumns = useHiddenEntityColumns("details", entity);
  const defaultDateFormat = useAppConfiguration<string>("default_date_format");
  const getEntityFieldLabels = useEntityFieldLabels(entity);
  const entityToOneReferenceFields = useEntityToOneReferenceFields(entity);
  const entityFieldSelections = useEntityFieldSelections(entity);
  const entityPresentationScript =
    useEntityConfiguration<IEntityPresentationScript>(
      "entity_presentation_script",
      entity
    );

  const error =
    dataDetails.error ||
    hiddenDetailsColumns.error ||
    entityFieldTypes.error ||
    defaultDateFormat.error ||
    entityFields.error ||
    entityPresentationScript.error ||
    entityToOneReferenceFields.error;

  const isLoading =
    dataDetails.isLoading ||
    defaultDateFormat.isLoading ||
    entityToOneReferenceFields.isLoading ||
    entity === SLUG_LOADING_VALUE ||
    entityFields.isLoading ||
    entityPresentationScript.isLoading ||
    hiddenDetailsColumns.isLoading;

  const viewState = useEntityViewStateMachine(
    isLoading,
    error,
    "details",
    entity
  );

  return (
    <ViewStateMachine
      loading={viewState.type === "loading" || !id}
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
      <div aria-label="Details Section">
        {filterOutHiddenScalarColumns(
          entityFields.data,
          hiddenDetailsColumns.data
        ).map(({ name }) => {
          const value$1 = dataDetails?.data?.[name];

          const value = evalutePresentationScript(
            entityPresentationScript.data.script,
            {
              field: name,
              from: "details",
              row: dataDetails?.data,
              value: value$1,
            }
          );

          const specialDataTypeRender = viewSpecialDataTypes({
            fieldName: name,
            value,
            entityToOneReferenceFields: entityToOneReferenceFields.data,
            entityFieldSelections,
            entityFieldTypes,
            options: {
              displayFrom,
              defaultDateFormat: defaultDateFormat.data,
            },
          });

          const contentToRender = specialDataTypeRender || (
            <Typo.SM>
              {typeof value === "object" ? JSON.stringify(value) : value}
            </Typo.SM>
          );

          return (
            <React.Fragment key={name}>
              <Typo.XXS weight="bold">{getEntityFieldLabels(name)}</Typo.XXS>
              {contentToRender}
              <Spacer />
            </React.Fragment>
          );
        })}
      </div>
    </ViewStateMachine>
  );
}
