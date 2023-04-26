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

export function MenuEntitiesSettings() {
  const tabFromUrl = useRouteParam("tab");

  useSetPageDetails({
    pageTitle: "Entities Settings",
    viewKey: SETTINGS_VIEW_KEY,
    permission: USER_PERMISSIONS.CAN_CONFIGURE_APP,
  });

  const changeTabParam = useChangeRouterParam("tab");

  const menuEntitiesToHide = useAppConfiguration<string[]>(
    "disabled_menu_entities"
  );
  const activeEntities = useActiveEntities();
  const userMenuEntities = useUserMenuEntities();

  const upsertHideFromMenuMutation = useUpsertConfigurationMutation(
    "disabled_menu_entities",
    "",
    {
      otherEndpoints: [ACTIVE_ENTITIES_ENDPOINT, USER_MENU_ENTITIES_ENDPOINT],
    }
  );

  const upsertEntitiesOrderMutation = useUpsertConfigurationMutation(
    "menu_entities_order",
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
      <SectionBox title="Menu Settings">
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
