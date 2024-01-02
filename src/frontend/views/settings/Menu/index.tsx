import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { USER_PERMISSIONS } from "shared/constants/user";
import { MAKE_APP_CONFIGURATION_CRUD_CONFIG } from "frontend/hooks/configuration/configuration.constant";
import { useRouteParam } from "frontend/lib/routing/useRouteParam";
import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import { useChangeRouterParam } from "frontend/lib/routing/useChangeRouterParam";
import { ListSkeleton } from "frontend/design-system/components/Skeleton/List";
import { Tabs } from "frontend/design-system/components/Tabs";
import { SectionBox } from "frontend/design-system/components/Section/SectionBox";
import { SortList } from "frontend/design-system/components/SortList";
import {
  useAppConfiguration,
  useUpsertConfigurationMutation,
} from "frontend/hooks/configuration/configuration.store";
import { useEntityDictionPlurals } from "frontend/hooks/entity/entity.queries";
import {
  ACTIVE_ENTITIES_ENDPOINT,
  useActiveEntities,
} from "frontend/hooks/entity/entity.store";
import { loadedDataState } from "frontend/lib/data/constants/loadedDataState";
import { NAVIGATION_MENU_ENDPOINT } from "frontend/_layouts/app/LayoutImpl/constants";
import { AppLayout } from "frontend/_layouts/app";
import { sortListByOrder } from "shared/lib/array/sort";
import { SETTINGS_VIEW_KEY } from "../constants";
import { EntitiesSelection } from "../Entities/Selection";

const CRUD_CONFIG = MAKE_APP_CONFIGURATION_CRUD_CONFIG(
  "disabled_menu_entities"
);

export function MenuSettings() {
  const tabFromUrl = useRouteParam("tab");

  useSetPageDetails({
    pageTitle: CRUD_CONFIG.TEXT_LANG.TITLE,
    viewKey: SETTINGS_VIEW_KEY,
    permission: USER_PERMISSIONS.CAN_CONFIGURE_APP,
  });

  const changeTabParam = useChangeRouterParam("tab");

  const menuEntitiesToHide = useAppConfiguration("disabled_menu_entities");

  const menuEntitiesOrder = useAppConfiguration("menu_entities_order");

  const activeEntities = useActiveEntities();

  const menuEntities: { label: string; value: string }[] = activeEntities.data
    .filter(({ value }) => !menuEntitiesToHide.data.includes(value))
    .sort((a, b) => a.value.localeCompare(b.value));

  sortListByOrder(menuEntitiesOrder.data, menuEntities, "value");

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
      <SectionBox title="Menu Settings">
        <Tabs
          currentTab={tabFromUrl}
          onChange={changeTabParam}
          contents={[
            {
              label: "Selection",
              content: (
                <ViewStateMachine
                  error={error}
                  loading={isLoading}
                  loader={<ListSkeleton count={20} />}
                >
                  <EntitiesSelection
                    type="active"
                    crudConfig={CRUD_CONFIG}
                    selectionKey="enabled-menu-entities-settings"
                    allList={activeEntities.data.map(({ value }) => value)}
                    getEntityFieldLabels={getEntitiesDictionPlurals}
                    hiddenList={menuEntitiesToHide.data}
                    onSubmit={upsertHideFromMenuMutation.mutateAsync}
                  />
                </ViewStateMachine>
              ),
            },
            {
              label: "Order",
              content: (
                <ViewStateMachine
                  error={error}
                  loading={isLoading}
                  loader={<ListSkeleton count={20} />}
                >
                  <SortList
                    data={loadedDataState(menuEntities)}
                    onSave={upsertEntitiesOrderMutation.mutateAsync}
                  />
                </ViewStateMachine>
              ),
            },
          ]}
        />
      </SectionBox>
    </AppLayout>
  );
}
