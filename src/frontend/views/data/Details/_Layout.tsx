import { ReactNode } from "react";
import { useEntityReferenceFields } from "frontend/hooks/entity/entity.store";
import {
  useEntityDataDetails,
  useEntityReferenceCount,
} from "frontend/hooks/data/data.store";
import { useEntityId } from "frontend/hooks/entity/entity.config";
import { AppLayout } from "frontend/_layouts/app";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { useEntityDictionPlurals } from "frontend/hooks/entity/entity.queries";
import { ContentLayout } from "frontend/design-system/components/Section/SectionDivider";
import { SectionBox } from "frontend/design-system/components/Section/SectionBox";
import {
  ListManager,
  ListManagerItem,
} from "frontend/design-system/components/ListManager";
import { IDropDownMenuItem } from "frontend/design-system/components/DropdownMenu";
import { DataStates } from "frontend/lib/data/types";
import { useEntityViewStateMachine } from "../hooks/useEntityViewStateMachine";
import { getEntitiesRelationsCount } from "./utils";
import {
  EntityActionTypes,
  useEntityActionMenuItems,
} from "../../entity/constants";

export const DETAILS_LAYOUT_KEY = "___DETAILS_KEY__";

interface IProps {
  children: ReactNode;
  entity: string;
  menuItems?: IDropDownMenuItem[];
  menuKey: string;
}

export function DetailsLayout({
  children,
  entity,
  menuKey,
  menuItems = [],
}: IProps) {
  const actionItems = useEntityActionMenuItems(
    [
      EntityActionTypes.Details,
      EntityActionTypes.Form,
      EntityActionTypes.Labels,
    ],
    entity
  );
  const entityId = useEntityId();

  const dataDetails = useEntityDataDetails({ entity, entityId });

  const referenceFields = useEntityReferenceFields(entity);

  const relatedEntities = referenceFields.data
    .filter(({ type, field }) => {
      if (type === "toMany") {
        return true;
      }
      if (dataDetails.isLoading) {
        return true;
      }
      return dataDetails.data[field];
    })
    .map(({ table: referenceTable, label }) => ({
      name: referenceTable,
      referencelabel: label,
    }));

  const getEntitiesDictionPlurals = useEntityDictionPlurals(
    relatedEntities,
    "name"
  );

  const relatedEntitiesMap = Object.fromEntries(
    referenceFields.data.map((relatedEntity) => [
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

  const listItems = [
    { name: DETAILS_LAYOUT_KEY, referencelabel: "Details" },
    ...relatedEntities,
  ];

  const relatedEntitiesLabelMap = Object.fromEntries(
    listItems.map((relatedEntity) => [
      relatedEntity.name,
      relatedEntity.referencelabel ||
        getEntitiesDictionPlurals(
          relatedEntity.name,
          relatedEntitiesMap[relatedEntity.name].type === "toOne"
        ),
    ])
  );

  const { isLoading, error } = referenceFields;

  const viewState = useEntityViewStateMachine({
    isLoading: isLoading || dataDetails.isLoading,
    error: error || dataDetails.error,
    crudAction: "details",
    entity,
  });

  return (
    <AppLayout actionItems={menuItems} secondaryActionItems={actionItems}>
      <ContentLayout>
        <ContentLayout.Left>
          <SectionBox headLess title="">
            <ListManager
              items={{
                data: listItems,
                error:
                  viewState.type === DataStates.Error
                    ? viewState.message
                    : undefined,
                isLoading: viewState.type === DataStates.Loading,
              }}
              listLengthGuess={5}
              labelField="name"
              getLabel={(name) => relatedEntitiesLabelMap[name]}
              render={(menuItem) => {
                if (menuItem.name === DETAILS_LAYOUT_KEY) {
                  return (
                    <ListManagerItem
                      label={menuItem.label}
                      key={menuItem.name}
                      active={menuKey === DETAILS_LAYOUT_KEY}
                      action={NAVIGATION_LINKS.ENTITY.DETAILS(entity, entityId)}
                    />
                  );
                }
                const entityType = relatedEntitiesMap[menuItem.name].type;
                const entityCount = getEntitiesRelationsCount(
                  entityType,
                  relatedEntitiesCounts.data[menuItem.name]
                );

                return (
                  <ListManagerItem
                    label={`${menuItem.label} ${entityCount}`}
                    key={menuItem.name}
                    active={menuKey === menuItem.name}
                    action={NAVIGATION_LINKS.ENTITY.RELATION_TABLE(
                      entity,
                      entityId,
                      menuItem.name,
                      entityType === "toOne" ? "one" : "many"
                    )}
                  />
                );
              }}
            />
          </SectionBox>
        </ContentLayout.Left>
        <ContentLayout.Right>{children}</ContentLayout.Right>
      </ContentLayout>
    </AppLayout>
  );
}
