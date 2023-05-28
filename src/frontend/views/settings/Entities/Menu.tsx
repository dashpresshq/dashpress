import {
  ListSkeleton,
  SectionBox,
  SortList,
  Spacer,
  Tabs,
  Typo,
} from "@hadmean/chromista";
import {
  useRouteParam,
  useChangeRouterParam,
  useSetPageDetails,
} from "frontend/lib/routing";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { USER_PERMISSIONS } from "shared/constants/user";
import { MAKE_CRUD_CONFIG } from "frontend/lib/makeCrudConfig";
import {
  useAppConfiguration,
  useUpsertConfigurationMutation,
} from "../../../hooks/configuration/configuration.store";
import { useEntityDictionPlurals } from "../../../hooks/entity/entity.queries";
import {
  ACTIVE_ENTITIES_ENDPOINT,
  USER_MENU_ENTITIES_ENDPOINT,
  useActiveEntities,
  useUserMenuEntities,
} from "../../../hooks/entity/entity.store";
import { SETTINGS_VIEW_KEY } from "../constants";
import { BaseSettingsLayout } from "../_Base";
import { EntitiesSelection } from "./Selection";

export const MENU_ENTITIES_SETTINGS_CRUD_CONFIG = MAKE_CRUD_CONFIG({
  path: "N/A",
  plural: "Menu Entities Settings",
  singular: "Menu Entities Settings",
});

export function MenuEntitiesSettings() {
  const tabFromUrl = useRouteParam("tab");

  useSetPageDetails({
    pageTitle: MENU_ENTITIES_SETTINGS_CRUD_CONFIG.TEXT_LANG.TITLE,
    viewKey: SETTINGS_VIEW_KEY,
    permission: USER_PERMISSIONS.CAN_CONFIGURE_APP,
  });

  const changeTabParam = useChangeRouterParam("tab");

  const menuEntitiesToHide = useAppConfiguration<string[]>(
    "disabled_menu_entities",
    MENU_ENTITIES_SETTINGS_CRUD_CONFIG
  );
  const activeEntities = useActiveEntities();
  const userMenuEntities = useUserMenuEntities();

  const upsertHideFromMenuMutation = useUpsertConfigurationMutation(
    "disabled_menu_entities",
    MENU_ENTITIES_SETTINGS_CRUD_CONFIG,
    "",
    {
      otherEndpoints: [ACTIVE_ENTITIES_ENDPOINT, USER_MENU_ENTITIES_ENDPOINT],
    }
  );

  const upsertEntitiesOrderMutation = useUpsertConfigurationMutation(
    "menu_entities_order",
    MENU_ENTITIES_SETTINGS_CRUD_CONFIG,
    "",
    {
      otherEndpoints: [ACTIVE_ENTITIES_ENDPOINT, USER_MENU_ENTITIES_ENDPOINT],
    }
  );

  const getEntitiesDictionPlurals = useEntityDictionPlurals(
    activeEntities.data || [],
    "value"
  );

  const error = menuEntitiesToHide.error || userMenuEntities.error;

  const isLoading = userMenuEntities.isLoading || menuEntitiesToHide.isLoading;

  return (
    <BaseSettingsLayout>
      <SectionBox title={MENU_ENTITIES_SETTINGS_CRUD_CONFIG.TEXT_LANG.TITLE}>
        <Typo.SM textStyle="italic">
          Toggle and order your entities as you will like to see them in the
          menu.
        </Typo.SM>
        <Spacer />
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
                    crudConfig={MENU_ENTITIES_SETTINGS_CRUD_CONFIG}
                    selectionKey="enabled-menu-entities-settings"
                    allList={(activeEntities.data || []).map(
                      ({ value }) => value
                    )}
                    getEntityFieldLabels={getEntitiesDictionPlurals}
                    hiddenList={menuEntitiesToHide.data || []}
                    onSubmit={async (data) => {
                      await upsertHideFromMenuMutation.mutateAsync(data);
                    }}
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
                    data={userMenuEntities}
                    onSave={
                      upsertEntitiesOrderMutation.mutateAsync as (
                        data: string[]
                      ) => Promise<void>
                    }
                  />
                </ViewStateMachine>
              ),
            },
          ]}
        />
      </SectionBox>
    </BaseSettingsLayout>
  );
}
