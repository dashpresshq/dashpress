import { StyledCard } from "@hadmean/chromista";
import { FilterOperators } from "@hadmean/protozoa";
import { useEntityReferenceFields } from "frontend/hooks/entity/entity.store";
import { useSetPageDetails, useRouteParam } from "frontend/lib/routing";
import { META_USER_PERMISSIONS } from "shared/constants/user";
import { GranularEntityPermissions } from "shared/types/user";
import {
  useEntityDiction,
  useEntityId,
  useEntitySlug,
} from "../../../hooks/entity/entity.config";
import { DetailsCanvas } from "../Table/DetailsCanvas";
import { TableTopComponent } from "../Table/portal";
import { EntityDataTable } from "../Table/DataTable/EntityDataTable";
import { ENTITY_DETAILS_VIEW_KEY } from "./constants";
import { DetailsLayout } from "./_Layout";
import { useTableMenuItems } from "../Table/useTableMenuItems";

export function EntityRelationTable() {
  const parentEntity = useEntitySlug();
  const entityId = useEntityId();
  const childEntity = useRouteParam("childEntity");
  const childEntityDiction = useEntityDiction(childEntity);

  const childEntityRelations = useEntityReferenceFields(childEntity);

  // :eyes Raise conditions on the table loading very fast initially then flickering to the reference search
  const referenceField = childEntityRelations.data.find(
    ({ table }) => table === parentEntity
  )?.field;

  const menuItems = useTableMenuItems(childEntity, {
    referenceField,
    entityId,
  });

  useSetPageDetails({
    pageTitle: `${childEntityDiction.singular} Table`,
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
      <TableTopComponent entity={childEntity} />
      <StyledCard>
        <EntityDataTable
          entity={childEntity}
          persitentFilters={
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
      </StyledCard>
      <DetailsCanvas />
    </DetailsLayout>
  );
}
