import { ListSkeleton, SectionBox, SortList, Tabs } from "@hadmean/chromista";
import {
  useRouteParam,
  useChangeRouterParam,
  useSetPageDetails,
} from "frontend/lib/routing";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { USER_PERMISSIONS } from "shared/constants/user";
import { MAKE_APP_CONFIGURATION_CRUD_CONFIG } from "frontend/hooks/configuration/configuration.constant";
import { DOCUMENTATION_LABEL } from "frontend/docs";
import { useState } from "react";
import { MenuEntitiesDocumentation } from "frontend/docs/menu-entities";
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

const CRUD_CONFIG = MAKE_APP_CONFIGURATION_CRUD_CONFIG(
  "disabled_menu_entities"
);

const DOCS_TITLE = "Menu Entities";

export function MenuEntitiesSettings() {
  const tabFromUrl = useRouteParam("tab");

  useSetPageDetails({
    pageTitle: CRUD_CONFIG.TEXT_LANG.TITLE,
    viewKey: SETTINGS_VIEW_KEY,
    permission: USER_PERMISSIONS.CAN_CONFIGURE_APP,
  });

  const [isDocOpen, setIsDocOpen] = useState(false);

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
    activeEntities.data,
    "value"
  );

  const error =
    menuEntitiesToHide.error || userMenuEntities.error || activeEntities.error;

  const isLoading =
    userMenuEntities.isLoading ||
    menuEntitiesToHide.isLoading ||
    activeEntities.isLoading;

  return (
    <BaseSettingsLayout>
      <SectionBox
        title={CRUD_CONFIG.TEXT_LANG.TITLE}
        iconButtons={[
          {
            action: () => setIsDocOpen(true),
            icon: "help",
            label: DOCUMENTATION_LABEL.CONCEPT(DOCS_TITLE),
          },
        ]}
      >
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
                    crudConfig={CRUD_CONFIG}
                    selectionKey="enabled-menu-entities-settings"
                    allList={activeEntities.data.map(({ value }) => value)}
                    getEntityFieldLabels={getEntitiesDictionPlurals}
                    hiddenList={menuEntitiesToHide.data}
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
      <MenuEntitiesDocumentation
        title={DOCS_TITLE}
        close={setIsDocOpen}
        isOpen={isDocOpen}
      />
    </BaseSettingsLayout>
  );
}
