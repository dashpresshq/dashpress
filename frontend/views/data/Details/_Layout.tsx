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
import {
  useEntityDataDetails,
  useEntityReferenceCount,
} from "frontend/hooks/data/data.store";
import {
  useEntityFieldLabels,
  useEntityId,
} from "frontend/hooks/entity/entity.config";
import { AppLayout } from "frontend/_layouts/app";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import {
  EntityActionTypes,
  useEntityActionMenuItems,
} from "../../entity/constants";
import { getEntitiesTabsCount } from "./utils";
import { useEntityViewStateMachine } from "../useEntityViewStateMachine";

export const DETAILS_LAYOUT_KEY = "___DETAILS_KEY__";

interface IProps {
  children: ReactNode;
  entity: string;
  menuKey: string;
}

export function DetailsLayout({ children, entity, menuKey }: IProps) {
  const actionItems = useEntityActionMenuItems([
    EntityActionTypes.Details,
    EntityActionTypes.Types,
    EntityActionTypes.Labels,
  ]);
  const entityId = useEntityId();

  const dataDetails = useEntityDataDetails(entity, entityId); // :eyes on getting all the fields so that errors dont show up if the required field is disabled

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
  const relatedEntitiesCounts = useEntityReferenceCount(
    relatedEntities
      .filter(({ name }) => relatedEntitiesMap[name].type === "toMany")
      .map(({ name }) => name),
    {
      entity,
      entityId,
    }
  );

  const { isLoading, error } = referenceFields;

  const viewState = useEntityViewStateMachine(
    isLoading || dataDetails.isLoading,
    error || dataDetails.error,
    "details"
  );

  return (
    <AppLayout actionItems={actionItems}>
      <SectionRow>
        <SectionLeft>
          <SectionBox headLess title="">
            {viewState.type === "error" && (
              <ErrorAlert message={viewState.message} />
            )}
            {(viewState.type === "render" || viewState.type === "loading") && (
              <RenderList
                items={[
                  { name: DETAILS_LAYOUT_KEY, label: "Details" },
                  ...relatedEntities,
                ]}
                singular="Relation"
                isLoading={viewState.type === "loading"}
                render={(menuItem) => {
                  if (menuItem.name === DETAILS_LAYOUT_KEY) {
                    return (
                      <SectionListItem
                        label="Details"
                        key={menuItem.name}
                        active={menuKey === DETAILS_LAYOUT_KEY}
                        to={NAVIGATION_LINKS.ENTITY.DETAILS(entity, entityId)}
                      />
                    );
                  }
                  const entityType = relatedEntitiesMap[menuItem.name].type;
                  const entityCount = getEntitiesTabsCount(
                    entityType,
                    relatedEntitiesCounts.data[menuItem.name]
                  );

                  const label =
                    menuItem.label || getEntityFieldLabels(menuItem.name);

                  return (
                    <SectionListItem
                      label={`${label} ${entityCount}`}
                      key={menuItem.name}
                      active={menuKey === menuItem.name}
                      to={
                        entityType === "toOne"
                          ? NAVIGATION_LINKS.ENTITY.RELATION_DETAILS(
                              entity,
                              entityId,
                              menuItem.name,
                              dataDetails.data[
                                relatedEntitiesMap[menuItem.name].field
                              ]
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
