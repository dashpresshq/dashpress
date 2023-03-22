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
import { EntityTableView } from "../Table/TableView";
import { ENTITY_DETAILS_VIEW_KEY } from "./constants";
import { DetailsLayout } from "./_Layout";

export function EntityRelationTable() {
  const entity = useEntitySlug();
  const entityId = useEntityId();
  const childEntity = useRouteParam("childEntity");
  const childEntityDiction = useEntityDiction(childEntity);

  const childEntityRelations = useEntityReferenceFields(childEntity);

  // :eyes Raise conditions on the table loading very fast initially then flickering to the reference search
  const referenceField = (childEntityRelations.data || []).find(
    ({ table }) => table === entity
  )?.field;

  useSetPageDetails({
    pageTitle: `${childEntityDiction.singular} Table`,
    viewKey: ENTITY_DETAILS_VIEW_KEY,
    permission: META_USER_PERMISSIONS.APPLIED_CAN_ACCESS_ENTITY(
      childEntity,
      GranularEntityPermissions.Show
    ),
  });

  return (
    <DetailsLayout entity={entity} menuKey={childEntity}>
      <StyledCard>
        <EntityTableView
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

// TODO const menuItems = useTableMenuItems(entity); and add default value link
