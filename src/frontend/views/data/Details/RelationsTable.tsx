import { msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { useEntityDataReference } from "frontend/hooks/data/data.store";
import {
  useEntityCrudConfig,
  useEntityId,
  useEntitySlug,
} from "frontend/hooks/entity/entity.config";
import { useEntityReferenceFields } from "frontend/hooks/entity/entity.store";
import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import { useRouteParam } from "frontend/lib/routing/useRouteParam";
import { META_USER_PERMISSIONS } from "shared/constants/user";
import { FilterOperators } from "shared/types/data";
import { GranularEntityPermissions } from "shared/types/user";

import { WholeEntityTable } from "../Table/_WholeEntityTable";
import {
  getEntityCreateLink,
  useTableMenuItems,
} from "../Table/useTableMenuItems";
import { DetailsLayout } from "./_Layout";
import { ENTITY_DETAILS_VIEW_KEY } from "./constants";

export function EntityRelationTable() {
  const parentEntity = useEntitySlug();
  const entityId = useEntityId();
  const { _ } = useLingui();
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
    : msg`${entityDataReference.data} - ${_(
        childEntityCrudConfig.TEXT_LANG.TITLE
      )}`;

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
