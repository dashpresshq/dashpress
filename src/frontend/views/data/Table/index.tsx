import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import { META_USER_PERMISSIONS } from "shared/constants/user";
import { GranularEntityPermissions } from "shared/types/user";
import { AppLayout } from "../../../_layouts/app";
import {
  useEntityCrudConfig,
  useEntitySlug,
} from "../../../hooks/entity/entity.config";
import {
  EntityActionTypes,
  useEntityActionMenuItems,
} from "../../entity/constants";
import { useTableMenuItems } from "./useTableMenuItems";
import { WholeEntityTable } from "./_WholeEntityTable";

export function EntityTable() {
  const entity = useEntitySlug();
  const entityCrudConfig = useEntityCrudConfig(entity);

  const actionItems = useEntityActionMenuItems([
    EntityActionTypes.Table,
    EntityActionTypes.Diction,
    EntityActionTypes.Labels,
    EntityActionTypes.Types,
  ]);

  useSetPageDetails({
    pageTitle: entityCrudConfig.TEXT_LANG.TITLE,
    viewKey: "ENTITY_TABLE",
    permission: META_USER_PERMISSIONS.APPLIED_CAN_ACCESS_ENTITY(
      entity,
      GranularEntityPermissions.Show
    ),
  });

  const menuItems = useTableMenuItems(entity);

  return (
    <AppLayout actionItems={menuItems} secondaryActionItems={actionItems}>
      <WholeEntityTable entity={entity} />
    </AppLayout>
  );
}
