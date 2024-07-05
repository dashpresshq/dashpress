import { Fragment } from "react";
import {
  useAppConfiguration,
  useEntityConfiguration,
} from "frontend/hooks/configuration/configuration.store";
import { useEntityDataDetails } from "frontend/hooks/data/data.store";
import {
  useEntityFieldLabels,
  useEntityFieldSelections,
  useProcessedEntityFieldTypes,
  useEntityCrudFields,
} from "frontend/hooks/entity/entity.config";
import { useEntityToOneReferenceFields } from "frontend/hooks/entity/entity.store";
import { DataStates } from "frontend/lib/data/types";
import { useEvaluateScriptContext } from "frontend/hooks/scripts";
import { ViewStateMachine } from "@/components/app/view-state-machine";
import { Skeleton } from "@/components/ui/skeleton";
import { useEntityViewStateMachine } from "../hooks/useEntityViewStateMachine";
import { viewSpecialDataTypes } from "../viewSpecialDataTypes";
import { evalutePresentationScript } from "../evaluatePresentationScript";
import { PreDataDetails } from "./portal";
import { PortalColumnRender } from "../Table/portal";

export function EntityDetailsView({
  entityId,
  entity,
  displayFrom,
}: {
  entityId: string;
  entity: string;
  displayFrom: "details" | "canvas";
}) {
  const dataDetails = useEntityDataDetails({ entity, entityId });
  const entityFieldTypes = useProcessedEntityFieldTypes(entity);
  const entityCrudFields = useEntityCrudFields(entity, "details");
  const defaultDateFormat = useAppConfiguration("default_date_format");
  const getEntityFieldLabels = useEntityFieldLabels(entity);
  const evaluateScriptContext = useEvaluateScriptContext();
  const entityToOneReferenceFields = useEntityToOneReferenceFields(entity);
  const entityFieldSelections = useEntityFieldSelections(entity);
  const entityPresentationScript = useEntityConfiguration(
    "entity_presentation_script",
    entity
  );

  const error =
    dataDetails.error ||
    entityCrudFields.error ||
    entityFieldTypes.error ||
    defaultDateFormat.error ||
    entityPresentationScript.error ||
    entityToOneReferenceFields.error;

  const isLoading =
    dataDetails.isLoading ||
    defaultDateFormat.isLoading ||
    entityToOneReferenceFields.isLoading ||
    entityPresentationScript.isLoading ||
    entityCrudFields.isLoading;

  const viewState = useEntityViewStateMachine({
    isLoading,
    error,
    crudAction: "details",
    entity,
  });

  return (
    <ViewStateMachine
      loading={viewState.type === DataStates.Loading || !entityId}
      error={
        viewState.type === DataStates.Error ? viewState.message : undefined
      }
      loader={
        <>
          {Array.from({ length: 7 }, (_, k) => k).map((key) => (
            <Fragment key={key}>
              <Skeleton className="mb-2 h-4 w-24" />
              <Skeleton className="mb-4 h-5 max-w-xs" />
            </Fragment>
          ))}
        </>
      }
    >
      <PreDataDetails entity={entity} entityId={entityId} />
      <div aria-label="Details Section">
        {entityCrudFields.data.map(({ name }) => {
          const rawValue = dataDetails?.data?.[name];

          const value = evalutePresentationScript(
            entityPresentationScript.data.script,
            {
              field: name,
              from: "details",
              row: dataDetails?.data,
              value: rawValue,
              ...evaluateScriptContext,
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
            <span className="break-words">
              {typeof value === "object" ? JSON.stringify(value) : value}
            </span>
          );

          return (
            <div
              className="[&_.show-on-hover]:opacity-0 [&_.show-on-hover]:hover:opacity-100"
              key={name}
            >
              <p className="text-xs font-semibold">
                {getEntityFieldLabels(name)}
              </p>
              <p className="mb-2 text-sm">
                <PortalColumnRender
                  {...{
                    column: name,
                    value: rawValue,
                    entity,
                    entityId,
                  }}
                >
                  {contentToRender}
                </PortalColumnRender>
              </p>
            </div>
          );
        })}
      </div>
    </ViewStateMachine>
  );
}
