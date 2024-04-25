import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { USER_PERMISSIONS } from "shared/constants/user";
import { MAKE_APP_CONFIGURATION_CRUD_CONFIG } from "frontend/hooks/configuration/configuration.constant";
import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import { ListSkeleton } from "frontend/design-system/components/Skeleton/List";
import { SectionBox } from "frontend/design-system/components/Section/SectionBox";
import {
  useAppConfiguration,
  useUpsertConfigurationMutation,
} from "frontend/hooks/configuration/configuration.store";
import { useEntityDictionPlurals } from "frontend/hooks/entity/entity.queries";
import { useActiveEntities } from "frontend/hooks/entity/entity.store";
import { NAVIGATION_MENU_ENDPOINT } from "frontend/_layouts/app/LayoutImpl/constants";
import { AppLayout } from "frontend/_layouts/app";
import { ACTIVE_ENTITIES_ENDPOINT } from "shared/constants/entities";
import { msg } from "@lingui/macro";
import { SETTINGS_VIEW_KEY } from "../constants";
import { EntitiesSelection } from "../Entities/Selection";

const CRUD_CONFIG = MAKE_APP_CONFIGURATION_CRUD_CONFIG(
  "disabled_menu_entities"
);

export function MenuSettings() {
  useSetPageDetails({
    pageTitle: CRUD_CONFIG.TEXT_LANG.TITLE,
    viewKey: SETTINGS_VIEW_KEY,
    permission: USER_PERMISSIONS.CAN_CONFIGURE_APP,
  });

  const menuEntitiesToHide = useAppConfiguration("disabled_menu_entities");

  const menuEntitiesOrder = useAppConfiguration("menu_entities_order");

  const activeEntities = useActiveEntities();

  const upsertHideFromMenuMutation = useUpsertConfigurationMutation(
    "disabled_menu_entities",
    "",
    {
      otherEndpoints: [ACTIVE_ENTITIES_ENDPOINT, NAVIGATION_MENU_ENDPOINT],
    }
  );

  const upsertEntitiesOrderMutation = useUpsertConfigurationMutation(
    "menu_entities_order",
    "",
    {
      otherEndpoints: [ACTIVE_ENTITIES_ENDPOINT, NAVIGATION_MENU_ENDPOINT],
    }
  );

  const getEntitiesDictionPlurals = useEntityDictionPlurals(
    activeEntities.data,
    "value"
  );

  const error =
    menuEntitiesToHide.error || activeEntities.error || menuEntitiesOrder.error;

  const isLoading =
    menuEntitiesToHide.isLoading ||
    activeEntities.isLoading ||
    menuEntitiesOrder.isLoading;

  return (
    <AppLayout>
      <SectionBox title={msg`Menu Settings`}>
        <ViewStateMachine
          error={error}
          loading={isLoading}
          loader={<ListSkeleton count={20} />}
        >
          <EntitiesSelection
            type="active"
            selectionKey="enabled-menu-entities-settings"
            allList={activeEntities.data.map(({ value }) => value)}
            getEntityFieldLabels={getEntitiesDictionPlurals}
            hiddenList={menuEntitiesToHide.data}
            onSubmit={upsertHideFromMenuMutation.mutateAsync}
            sort={{
              order: menuEntitiesOrder.data,
              save: upsertEntitiesOrderMutation.mutateAsync,
            }}
          />
        </ViewStateMachine>
      </SectionBox>
    </AppLayout>
  );
}
