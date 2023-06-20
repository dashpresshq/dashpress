import { useEntityReferenceFields } from "frontend/hooks/entity/entity.store";
import { useSetPageDetails, useRouteParam } from "frontend/lib/routing";
import { META_USER_PERMISSIONS } from "shared/constants/user";
import { GranularEntityPermissions } from "shared/types/user";
import { useEntityDataReference } from "frontend/hooks/data/data.store";
import { FilterOperators } from "@hadmean/protozoa";
import {
  useEntityCrudConfig,
  useEntityId,
  useEntitySlug,
} from "../../../hooks/entity/entity.config";
import { ENTITY_DETAILS_VIEW_KEY } from "./constants";
import { DetailsLayout } from "./_Layout";
import { useTableMenuItems } from "../Table/useTableMenuItems";
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
    viewKey: ENTITY_DETAILS_VIEW_KEY,
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
        persistFilters={
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
