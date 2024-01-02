import { useEntityReferenceFields } from "frontend/hooks/entity/entity.store";
import { META_USER_PERMISSIONS } from "shared/constants/user";
import { GranularEntityPermissions } from "shared/types/user";
import { useEntityDataReference } from "frontend/hooks/data/data.store";
import { useRouteParam } from "frontend/lib/routing/useRouteParam";
import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import { FilterOperators } from "shared/types/data";
import {
  useEntityCrudConfig,
  useEntityId,
  useEntitySlug,
} from "frontend/hooks/entity/entity.config";
import { ENTITY_DETAILS_VIEW_KEY } from "./constants";
import { DetailsLayout } from "./_Layout";
import {
  getEntityCreateLink,
  useTableMenuItems,
} from "../Table/useTableMenuItems";
import { WholeEntityTable } from "../Table/_WholeEntityTable";

export function EntityRelationTable() {
  const parentEntity = useEntitySlug();
  const entityId = useEntityId();
  const childEntity = useRouteParam("childEntity");
  const childEntityCrudConfig = useEntityCrudConfig(childEntity);
  const entityDataReference = useEntityDataReference(parentEntity, entityId);

  const childEntityRelations = useEntityReferenceFields(childEntity);

  const referenceField = childEntityRelations.data.find(
    ({ table }) => table === parentEntity
  )?.field;

  const menuItems = useTableMenuItems(childEntity, {
    referenceField,
    entityId,
  });

  const title = entityDataReference.isLoading
    ? childEntityCrudConfig.TEXT_LANG.SINGULAR
    : `${entityDataReference.data} - ${childEntityCrudConfig.TEXT_LANG.TITLE}`;

  useSetPageDetails({
    pageTitle: title,
    viewKey: ENTITY_DETAILS_VIEW_KEY(parentEntity),
    permission: META_USER_PERMISSIONS.APPLIED_CAN_ACCESS_ENTITY(
      childEntity,
      GranularEntityPermissions.Show
    ),
  });

  return (
    <DetailsLayout
      entity={parentEntity}
      menuKey={childEntity}
      menuItems={menuItems}
    >
      <WholeEntityTable
        entity={childEntity}
        skipColumns={referenceField ? [referenceField] : []}
        createNewLink={getEntityCreateLink(childEntity, {
          referenceField,
          entityId,
        })}
        persistentFilters={
          referenceField
            ? [
                {
                  id: referenceField,
                  value: {
                    operator: FilterOperators.EQUAL_TO,
                    value: entityId,
                  },
                },
              ]
            : []
        }
      />
    </DetailsLayout>
  );
}
