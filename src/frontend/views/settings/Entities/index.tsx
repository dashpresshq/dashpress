import { ListSkeleton, SectionBox, SortList, Tabs } from "@hadmean/chromista";
import {
  useRouteParam,
  useChangeRouterParam,
  useSetPageDetails,
} from "frontend/lib/routing";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { LINK_TO_DOCS } from "frontend/views/constants";
import { USER_PERMISSIONS } from "shared/types/user";
import {
  useAppConfiguration,
  useUpsertConfigurationMutation,
} from "../../../hooks/configuration/configuration.store";
import { useEntityDictionPlurals } from "../../../hooks/entity/entity.queries";
import {
  ACTIVE_ENTITIES_ENDPOINT,
  useEntitiesList,
  useActiveEntities,
} from "../../../hooks/entity/entity.store";
import { SETTINGS_VIEW_KEY } from "../constants";
import { BaseSettingsLayout } from "../_Base";
import { EntitiesSelection } from "./Selection";

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
  const activeEntities = useActiveEntities();

  const upsertHideFromMenuMutation = useUpsertConfigurationMutation(
    "disabled_entities",
    "",
    { otherEndpoints: [ACTIVE_ENTITIES_ENDPOINT] }
  );

  const upsertEntitiesOrderMutation = useUpsertConfigurationMutation(
    "entities_order",
    "",
    {
      otherEndpoints: [ACTIVE_ENTITIES_ENDPOINT],
    }
  );

  const entitiesDictionPlurals = useEntityDictionPlurals(
    entitiesList.data || [],
    "value"
  );

  const error = entitiesList.error || entitiesToHide.error;

  const isLoading = entitiesList.isLoading || entitiesToHide.isLoading;

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
              content: (
                <ViewStateMachine
                  error={error}
                  loading={isLoading}
                  loader={<ListSkeleton count={20} />}
                >
                  <EntitiesSelection
                    allList={(entitiesList.data || []).map(
                      ({ label }) => label
                    )}
                    getEntityFieldLabels={entitiesDictionPlurals}
                    hiddenList={entitiesToHide.data || []}
                    onSubmit={async (data) => {
                      await upsertHideFromMenuMutation.mutateAsync(data);
                    }}
                  />
                </ViewStateMachine>
              ),
              label: "Selection",
            },
            {
              content: (
                <ViewStateMachine
                  error={error}
                  loading={isLoading}
                  loader={<ListSkeleton count={20} />}
                >
                  <SortList
                    data={activeEntities}
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
