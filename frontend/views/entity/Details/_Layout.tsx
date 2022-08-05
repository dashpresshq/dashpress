import {
  ErrorAlert,
  RenderList,
  SectionBox,
  SectionLeft,
  SectionRight,
  SectionListItem,
  SectionRow,
} from "@gothicgeeks/design-system";
import { ReactNode } from "react";
import { useEntityReferenceFields } from "frontend/hooks/entity/entity.store";
import { useEntitiesCount } from "frontend/hooks/data/data.store";
import {
  useEntityFieldLabels,
  useEntityId,
} from "../../../hooks/entity/entity.config";
import {
  EntityActionTypes,
  useEntityActionMenuItems,
} from "../Configure/constants";
import { AppLayout } from "../../../_layouts/app";
import { getEntitiesTabsCount } from "./utils";
import { NAVIGATION_LINKS } from "../../../lib/routing/links";
import { useViewStateMachine } from "../useViewStateMachine";

interface IProps {
  children: ReactNode;
  entity: string;
}

export function DetailsLayout({ children, entity }: IProps) {
  const actionItems = useEntityActionMenuItems([
    EntityActionTypes.Details,
    EntityActionTypes.Types,
    EntityActionTypes.Labels,
  ]);
  const entityId = useEntityId();

  const referenceFields = useEntityReferenceFields(entity);

  const getEntityFieldLabels = useEntityFieldLabels();
  const relatedEntities = (referenceFields.data || []).map(
    ({ table: referenceTable, label }) => ({
      name: referenceTable,
      label,
    })
  );

  const relatedEntitiesMap = Object.fromEntries(
    (referenceFields.data || []).map((relatedEntity) => [
      relatedEntity.table,
      relatedEntity,
    ])
  );
  const relatedEntitiesCounts = useEntitiesCount(
    relatedEntities
      .filter(({ name }) => relatedEntitiesMap[name].type === "toMany")
      .map(({ name }) => name)
  );

  const { isLoading, error } = referenceFields;

  const viewState = useViewStateMachine(isLoading, error, "details");

  return (
    <AppLayout actionItems={actionItems}>
      <SectionRow>
        <SectionLeft>
          <SectionBox title="Relations">
            {viewState.type === "error" && (
              <ErrorAlert message={viewState.message} />
            )}
            {(viewState.type === "render" || viewState.type === "loading") && (
              <RenderList
                items={relatedEntities}
                singular="Relation"
                isLoading={viewState.type === "loading"}
                render={(menuItem) => {
                  const entityType = relatedEntitiesMap[menuItem.name].type;
                  const entityCount = getEntitiesTabsCount(
                    entityType,
                    relatedEntitiesCounts.data[menuItem.name]
                  );

                  return (
                    <SectionListItem
                      label={`${getEntityFieldLabels(
                        menuItem.name
                      )} ${entityCount}`}
                      key={menuItem.name}
                      to={
                        entityType === "toOne"
                          ? NAVIGATION_LINKS.ENTITY.RELATION_DETAILS(
                              entity,
                              entityId,
                              menuItem.name,
                              ""
                            )
                          : NAVIGATION_LINKS.ENTITY.RELATION_TABLE(
                              entity,
                              entityId,
                              menuItem.name
                            )
                      }
                    />
                  );
                }}
              />
            )}
          </SectionBox>
        </SectionLeft>
        <SectionRight>{children}</SectionRight>
      </SectionRow>
    </AppLayout>
  );
}

// TODO

// How to get relation count

// How many views a deal item has

// So we need to send a request

// count /dealViews/:dealItemId/dealItem

// SELECT * FROM dealviews where dealItemId = :dealItemId
