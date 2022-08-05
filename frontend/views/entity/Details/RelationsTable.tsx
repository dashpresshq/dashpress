import { useRouteParam } from "@gothicgeeks/shared";
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
  const childEntity = useRouteParam("childEntity");

  useSetPageTitle(`${entityDiction.singular} Details`, "ENTITY_DETAILS");

  return (
    <DetailsLayout entity={entity} menuKey={childEntity}>
      <EntityTableView entity={childEntity} />
    </DetailsLayout>
  );
}
