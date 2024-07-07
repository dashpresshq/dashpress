import { msg } from "@lingui/macro";

import { SectionBox } from "@/components/app/section-box";
import { ListSkeleton } from "@/components/app/skeleton/list";
import { ViewStateMachine } from "@/components/app/view-state-machine";
import { AppLayout } from "@/frontend/_layouts/app";
import { NAVIGATION_MENU_ENDPOINT } from "@/frontend/_layouts/app/NavigationSideBar/constants";
import { useAppConfigurationDomainMessages } from "@/frontend/hooks/configuration/configuration.constant";
import {
  useAppConfiguration,
  useUpsertConfigurationMutation,
} from "@/frontend/hooks/configuration/configuration.store";
import { useEntityDictionPlurals } from "@/frontend/hooks/entity/entity.queries";
import { useActiveEntities } from "@/frontend/hooks/entity/entity.store";
import { useSetPageDetails } from "@/frontend/lib/routing/usePageDetails";
import { ACTIVE_ENTITIES_ENDPOINT } from "@/shared/constants/entities";
import { UserPermissions } from "@/shared/constants/user";

import { SETTINGS_VIEW_KEY } from "../constants";
import { EntitiesSelection } from "../Entities/Selection";

export function MenuSettings() {
  const domainMessages = useAppConfigurationDomainMessages(
    "disabled_menu_entities"
  );

  useSetPageDetails({
    pageTitle: domainMessages.TEXT_LANG.TITLE,
    viewKey: SETTINGS_VIEW_KEY,
    permission: UserPermissions.CAN_CONFIGURE_APP,
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
