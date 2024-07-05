import { AppLayout } from "frontend/_layouts/app";
import {
  useEntityDataDetails,
  useEntityReferenceCount,
} from "frontend/hooks/data/data.store";
import { useEntityId } from "frontend/hooks/entity/entity.config";
import { useEntityDictionPlurals } from "frontend/hooks/entity/entity.queries";
import { useEntityReferenceFields } from "frontend/hooks/entity/entity.store";
import { DataStates } from "frontend/lib/data/types";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import type { ReactNode } from "react";

import type { IMenuActionItem } from "@/components/app/button/types";
import { ContentLayout } from "@/components/app/content-layout";
import { MenuSection } from "@/components/app/menu-section";
import { ListSkeleton } from "@/components/app/skeleton/list";
import { ViewStateMachine } from "@/components/app/view-state-machine";
import { Card, CardContent } from "@/components/ui/card";
import { fakeMessageDescriptor } from "@/translations/fake";

import { useEntityActionMenuItems } from "../../entity/constants";
import { useEntityViewStateMachine } from "../hooks/useEntityViewStateMachine";
import { getEntitiesRelationsCount } from "./utils";

export const DETAILS_LAYOUT_KEY = "___DETAILS_KEY__";

interface IProps {
  children: ReactNode;
  entity: string;
  menuItems?: IMenuActionItem[];
  menuKey: string;
}

export function DetailsLayout({
  children,
  entity,
  menuKey,
  menuItems = [],
}: IProps) {
  const actionItems = useEntityActionMenuItems(entity);
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

  const { isLoading, error } = referenceFields;

  const viewState = useEntityViewStateMachine({
    isLoading: isLoading || dataDetails.isLoading || referenceFields.isLoading,
    error: error || dataDetails.error,
    crudAction: "details",
    entity,
  });

  return (
    <AppLayout actionItems={menuItems} secondaryActionItems={actionItems}>
      <ContentLayout>
        <ContentLayout.Left>
          <ViewStateMachine
            loading={viewState.type === DataStates.Loading}
            error={
              viewState.type === DataStates.Error
                ? viewState.message
                : undefined
            }
            loader={
              <Card>
                <CardContent>
                  <ListSkeleton count={8} />
                </CardContent>
              </Card>
            }
          >
            <MenuSection
              menuItems={listItems.map((menuItem) => {
                const label =
                  menuItem.referencelabel ||
                  getEntitiesDictionPlurals(
                    menuItem.name,
                    relatedEntitiesMap[menuItem.name].type === "toOne"
                  );
                if (menuItem.name === DETAILS_LAYOUT_KEY) {
                  const props: IMenuActionItem = {
                    id: "details",
                    systemIcon: "none",
                    label: fakeMessageDescriptor(label),
                    active: menuKey === DETAILS_LAYOUT_KEY,
                    action: NAVIGATION_LINKS.ENTITY.DETAILS(entity, entityId),
                  };
                  return props;
                }
                const entityType =
                  relatedEntitiesMap[menuItem.name]?.type || "toOne";
                const entityCount = getEntitiesRelationsCount(
                  entityType,
                  relatedEntitiesCounts.data[menuItem.name]
                );

                const props: IMenuActionItem = {
                  label: fakeMessageDescriptor(`${label} ${entityCount}`),
                  id: menuItem.name,
                  systemIcon: "none",
                  active: menuKey === menuItem.name,
                  action: NAVIGATION_LINKS.ENTITY.RELATION_TABLE(
                    entity,
                    entityId,
                    menuItem.name,
                    entityType === "toOne" ? "one" : "many"
                  ),
                };

                return props;
              })}
            />
          </ViewStateMachine>
        </ContentLayout.Left>
        <ContentLayout.Right>{children}</ContentLayout.Right>
      </ContentLayout>
    </AppLayout>
  );
}
