import { FilterOperators } from "@gothicgeeks/design-system";
import { useRouteParam } from "@gothicgeeks/shared";
import { useEntityReferenceFields } from "frontend/hooks/entity/entity.store";
import { useSetPageTitle } from "frontend/lib/routing";
import {
  useEntityDiction,
  useEntityId,
  useEntitySlug,
} from "../../../hooks/entity/entity.config";
import { EntityTableView } from "../Table/TableView";
import { DetailsLayout } from "./_Layout";

export function EntityRelationTable() {
  const entityDiction = useEntityDiction();
  const entity = useEntitySlug();
  const entityId = useEntityId();
  const childEntity = useRouteParam("childEntity");

  const childEntityRelations = useEntityReferenceFields(childEntity);

  // :eyes Raise conditions on the table loading very fast initially then flickering to the reference search
  const referenceField = (childEntityRelations.data || []).find(
    ({ table }) => table === entity
  )?.field;

  useSetPageTitle(`${entityDiction.singular} Details`, "ENTITY_DETAILS");

  return (
    <DetailsLayout entity={entity} menuKey={childEntity}>
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
    </DetailsLayout>
  );
}
