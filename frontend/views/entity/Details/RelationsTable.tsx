import { useSetPageTitle } from "frontend/lib/routing";
import {
  useEntityDiction,
  useEntitySlug,
} from "../../../hooks/entity/entity.config";
import { EntityTableView } from "../Table/TableView";
import { DetailsLayout } from "./_Layout";

export function EntityRelationTable() {
  const entityDiction = useEntityDiction();
  const entity = useEntitySlug();

  useSetPageTitle(`${entityDiction.singular} Details`, "ENTITY_DETAILS");

  return (
    <DetailsLayout entity={entity}>
      <EntityTableView entity={entity} />
    </DetailsLayout>
  );
}
