import { Fragment } from "react";
import {
  useAppConfiguration,
  useEntityConfiguration,
} from "frontend/hooks/configuration/configuration.store";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { BaseSkeleton } from "frontend/design-system/components/Skeleton/Base";
import { Typo } from "frontend/design-system/primitives/Typo";
import { Spacer } from "frontend/design-system/primitives/Spacer";
import { useEntityDataDetails } from "frontend/hooks/data/data.store";
import {
  useEntityFieldLabels,
  useEntityFieldSelections,
  useProcessedEntityFieldTypes,
  useEntityCrudFields,
} from "frontend/hooks/entity/entity.config";
import { useEntityToOneReferenceFields } from "frontend/hooks/entity/entity.store";
import { DataStates } from "frontend/lib/data/types";
import styled from "styled-components";
import { useEvaluateScriptContext } from "frontend/hooks/scripts";
import { useEntityViewStateMachine } from "../hooks/useEntityViewStateMachine";
import { viewSpecialDataTypes } from "../viewSpecialDataTypes";
import { evalutePresentationScript } from "../evaluatePresentationScript";
import { PreDataDetails } from "./portal";
import { PortalColumnRender } from "../Table/portal";

const ContentText = styled(Typo.SM)`
  overflow-wrap: anywhere;
`;

const DetailItem = styled.div`
  .show-on-hover {
    opacity: 0;
  }
  &:hover {
    .show-on-hover {
      opacity: 1;
    }
  }
`;

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
              <BaseSkeleton height="18px" width="100px" bottom={8} />
              <BaseSkeleton height="20px" bottom={16} />
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
            <ContentText>
              {typeof value === "object" ? JSON.stringify(value) : value}
            </ContentText>
          );

          return (
            <DetailItem key={name}>
              <Typo.XXS $weight="bold">{getEntityFieldLabels(name)}</Typo.XXS>
              <Typo.XS>
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
              </Typo.XS>
              <Spacer />
            </DetailItem>
          );
        })}
      </div>
    </ViewStateMachine>
  );
}
