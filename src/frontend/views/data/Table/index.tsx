import {
  // useChangeRouterParam,
  // useRouteParam,
  useSetPageDetails,
} from "frontend/lib/routing";
import { META_USER_PERMISSIONS } from "shared/types";
import { StyledCard } from "@hadmean/chromista";
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

  // const tabFromUrl = useRouteParam("tab");
  // Tinker with build
  // const changeTabParam = useChangeRouterParam("tab");

  return (
    <AppLayout actionItems={menuItems} secondaryActionItems={actionItems}>
      <StyledCard>
        {/* <Tabs
          padContent={false}
          currentTab={tabFromUrl}
          onChange={changeTabParam}
          contents={[
            {
              content: <EntityTableView entity={entity} />,
              label: "DEFAULT",
            },
          ]}
        /> */}
        <EntityTableView entity={entity} />
      </StyledCard>
    </AppLayout>
  );
}
