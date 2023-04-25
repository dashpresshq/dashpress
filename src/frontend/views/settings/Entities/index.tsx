import { ListSkeleton, SectionBox, SortList, Tabs } from "@hadmean/chromista";
import {
  useRouteParam,
  useChangeRouterParam,
  useSetPageDetails,
} from "frontend/lib/routing";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { LINK_TO_DOCS } from "frontend/views/constants";
import { USER_PERMISSIONS } from "shared/constants/user";
import { dataNotFoundMessage, useApi } from "@hadmean/protozoa";
import { ILabelValue } from "types";
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

const useEntitiesList = () =>
  useApi<ILabelValue[]>("/api/entities/list", {
    errorMessage: dataNotFoundMessage("Entities list"),
  });

export function EntitiesSettings() {
  const entitiesList = useEntitiesList();
  const tabFromUrl = useRouteParam("tab");

  useSetPageDetails({
    pageTitle: "Entities Settings",
    viewKey: SETTINGS_VIEW_KEY,
    permission: USER_PERMISSIONS.CAN_CONFIGURE_APP,
  });

  const changeTabParam = useChangeRouterParam("tab");

  const entitiesToHide = useAppConfiguration<string[]>("disabled_entities");
  const menuEntitiesToHide = useAppConfiguration<string[]>(
    "disabled_menu_entities"
  );
  const activeEntities = useActiveEntities();
  const userMenuEntities = useUserMenuEntities();

  const upsertHideFromAppMutation = useUpsertConfigurationMutation(
    "disabled_entities",
    "",
    {
      otherEndpoints: [ACTIVE_ENTITIES_ENDPOINT, USER_MENU_ENTITIES_ENDPOINT],
    }
  );

  const upsertHideFromMenuMutation = useUpsertConfigurationMutation(
    "disabled_menu_entities",
    "",
    {
      otherEndpoints: [ACTIVE_ENTITIES_ENDPOINT, USER_MENU_ENTITIES_ENDPOINT],
    }
  );

  const upsertEntitiesOrderMutation = useUpsertConfigurationMutation(
    "entities_order",
    "",
    {
      otherEndpoints: [ACTIVE_ENTITIES_ENDPOINT, USER_MENU_ENTITIES_ENDPOINT],
    }
  );

  const getEntitiesDictionPlurals = useEntityDictionPlurals(
    entitiesList.data || [],
    "value"
  );

  const error =
    entitiesList.error ||
    entitiesToHide.error ||
    menuEntitiesToHide.error ||
    userMenuEntities.error;

  const isLoading =
    entitiesList.isLoading ||
    userMenuEntities.isLoading ||
    entitiesToHide.isLoading ||
    menuEntitiesToHide.isLoading;

  return (
    <BaseSettingsLayout>
      <SectionBox
        title="Entities Settings"
        iconButtons={[
          {
            action: LINK_TO_DOCS("app-configuration/entities"),
            icon: "help",
            label: "Entities Settings Documentation",
          },
        ]}
      >
        <Tabs
          currentTab={tabFromUrl}
          onChange={changeTabParam}
          contents={[
            {
              label: "Application Enabled Entities",
              content: (
                <ViewStateMachine
                  error={error}
                  loading={isLoading}
                  loader={<ListSkeleton count={20} />}
                >
                  <EntitiesSelection
                    selectionKey="enabled-entities-settings"
                    allList={(entitiesList.data || []).map(
                      ({ value }) => value
                    )}
                    getEntityFieldLabels={getEntitiesDictionPlurals}
                    hiddenList={entitiesToHide.data || []}
                    onSubmit={async (data) => {
                      await upsertHideFromAppMutation.mutateAsync(data);
                    }}
                  />
                </ViewStateMachine>
              ),
            },
            {
              label: "Menu Entities",
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
              label: "Order",
            },
          ]}
        />
      </SectionBox>
    </BaseSettingsLayout>
  );
}
