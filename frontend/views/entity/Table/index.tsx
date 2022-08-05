import { useSetPageTitle } from "frontend/lib/routing";
import { AppLayout } from "../../../_layouts/app";
import {
  useEntityDiction,
  useEntitySlug,
} from "../../../hooks/entity/entity.config";
import {
  EntityActionTypes,
  useEntityActionMenuItems,
} from "../Configure/constants";
import { EntityTableView } from "./TableView";

// TODO sync table to url
// TODO when table passes a limit then a non synced columns to show
export function EntityTable() {
  const entity = useEntitySlug();
  const entityDiction = useEntityDiction(entity);

  const actionItems = useEntityActionMenuItems([
    EntityActionTypes.Table,
    EntityActionTypes.Diction,
    EntityActionTypes.Labels,
    EntityActionTypes.Types,
  ]);

  useSetPageTitle(entityDiction.plural, "ENTITY_TABLE");

  return (
    <AppLayout actionItems={actionItems}>
      <EntityTableView entity={entity} />
    </AppLayout>
  );
}
