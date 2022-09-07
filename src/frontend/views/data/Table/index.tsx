import { useSetPageDetails } from "frontend/lib/routing";
import { META_USER_PERMISSIONS } from "shared/types";
import { AppLayout } from "../../../_layouts/app";
import {
  useEntityDiction,
  useEntitySlug,
} from "../../../hooks/entity/entity.config";
import {
  EntityActionTypes,
  useEntityActionMenuItems,
} from "../../entity/constants";
import { EntityTableView } from "./TableView";
import { useTableMenuItems } from "./useTableMenuItems";

export function EntityTable() {
  const entity = useEntitySlug();
  const entityDiction = useEntityDiction(entity);

  const actionItems = useEntityActionMenuItems([
    EntityActionTypes.Table,
    EntityActionTypes.Diction,
    EntityActionTypes.Labels,
    EntityActionTypes.Types,
  ]);

  useSetPageDetails({
    pageTitle: entityDiction.plural,
    viewKey: "ENTITY_TABLE",
    permission: META_USER_PERMISSIONS.APPLIED_CAN_ACCESS_ENTITY(entity),
  });

  const menuItems = useTableMenuItems(entity);

  return (
    <AppLayout actionItems={menuItems} secondaryActionItems={actionItems}>
      <EntityTableView entity={entity} />
    </AppLayout>
  );
}
