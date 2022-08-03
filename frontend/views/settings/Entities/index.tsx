import {
  ErrorAlert,
  SectionBox,
  SortList,
  Tabs,
} from "@gothicgeeks/design-system";
import { useRouteParam } from "@gothicgeeks/shared";
import { useSetPageTitle, useChangeRouterParam } from "frontend/lib/routing";
import {
  useAppConfiguration,
  useUpsertConfigurationMutation,
} from "../../../hooks/configuration/configration.store";
import { useEntityDictionPlurals } from "../../../hooks/entity/entity.queries";
import {
  ENTITIES_MENU_ENDPOINT,
  useEntitiesList,
  useEntitiesMenuItems,
} from "../../../hooks/entity/entity.store";
import { BaseSettingsLayout } from "../_Base";
import { EntitiesSelection } from "./Selection";

export function EntitiesSettings() {
  const entitiesList = useEntitiesList();
  const tabFromUrl = useRouteParam("tab");
  useSetPageTitle("Entities Settings");

  const changeTabParam = useChangeRouterParam("tab");

  const entitiesToHide = useAppConfiguration<string[]>("disabled_entities");
  const entitiesMenuItems = useEntitiesMenuItems();

  const upsertHideFromMenuMutation = useUpsertConfigurationMutation(
    "disabled_entities",
    "",
    { otherEndpoints: [ENTITIES_MENU_ENDPOINT] }
  );

  const upsertEntitiesOrderMutation = useUpsertConfigurationMutation(
    "entities_order",
    "",
    {
      otherEndpoints: [ENTITIES_MENU_ENDPOINT],
    }
  );

  const entitiesDictionPlurals = useEntityDictionPlurals(
    entitiesList.data || [],
    "value"
  );

  return (
    <BaseSettingsLayout>
      <ErrorAlert message={entitiesList.error || entitiesToHide.error} />
      <SectionBox title="Entities Settings">
        <Tabs
          currentTab={tabFromUrl}
          onChange={changeTabParam}
          contents={[
            // TODO Entities to hide in dashboard
            {
              content: (
                <EntitiesSelection
                  description="Disable entitites that you dont want to appear anywhere in the app"
                  isLoading={entitiesList.isLoading || entitiesToHide.isLoading}
                  allList={entitiesList.data || []}
                  getEntityFieldLabels={entitiesDictionPlurals}
                  hiddenList={entitiesToHide.data || []}
                  onSubmit={async (data) => {
                    await upsertHideFromMenuMutation.mutateAsync(data);
                  }}
                />
              ),
              label: "Selection",
            },
            {
              content: (
                <SortList
                  data={entitiesMenuItems}
                  onSave={async (data) => {
                    await upsertEntitiesOrderMutation.mutateAsync(data);
                  }}
                />
              ),
              label: "Order",
            },
          ]}
        />
      </SectionBox>
    </BaseSettingsLayout>
  );
}
