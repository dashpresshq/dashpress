import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { UserPermissions } from "shared/constants/user";
import { ILabelValue } from "shared/types/options";
import { useAppConfigurationDomainMessages } from "frontend/hooks/configuration/configuration.constant";
import { EnabledEntitiesDocumentation } from "frontend/docs/enabled-entities";
import { useApi } from "frontend/lib/data/useApi";
import { ListSkeleton } from "frontend/design-system/components/Skeleton/List";
import { SectionBox } from "frontend/design-system/components/Section/SectionBox";
import {
  useAppConfiguration,
  useUpsertConfigurationMutation,
} from "frontend/hooks/configuration/configuration.store";
import { useEntityDictionPlurals } from "frontend/hooks/entity/entity.queries";
import { NAVIGATION_MENU_ENDPOINT } from "frontend/_layouts/app/NavigationSideBar/constants";
import { ACTIVE_ENTITIES_ENDPOINT } from "shared/constants/entities";
import { useDocumentationActionButton } from "frontend/docs/constants";
import { SETTINGS_VIEW_KEY } from "../constants";
import { BaseSettingsLayout } from "../_Base";
import { EntitiesSelection } from "./Selection";

const useEntitiesList = () => {
  const domainMessages = useAppConfigurationDomainMessages("disabled_entities");

  return useApi<ILabelValue[]>("/api/entities/list", {
    errorMessage: domainMessages.TEXT_LANG.NOT_FOUND,
    defaultData: [],
  });
};

export function EntitiesSettings() {
  const domainMessages = useAppConfigurationDomainMessages("disabled_entities");
  const entitiesList = useEntitiesList();

  useSetPageDetails({
    pageTitle: domainMessages.TEXT_LANG.TITLE,
    viewKey: SETTINGS_VIEW_KEY,
    permission: UserPermissions.CAN_CONFIGURE_APP,
  });

  const entitiesToHide = useAppConfiguration("disabled_entities");

  const upsertHideFromAppMutation = useUpsertConfigurationMutation(
    "disabled_entities",
    "",
    {
      otherEndpoints: [ACTIVE_ENTITIES_ENDPOINT, NAVIGATION_MENU_ENDPOINT],
    }
  );

  const getEntitiesDictionPlurals = useEntityDictionPlurals(
    entitiesList.data,
    "value"
  );

  const documentationActionButton = useDocumentationActionButton(
    domainMessages.TEXT_LANG.TITLE
  );

  const error = entitiesList.error || entitiesToHide.error;

  const isLoading = entitiesList.isLoading || entitiesToHide.isLoading;

  return (
    <BaseSettingsLayout>
      <SectionBox
        title={domainMessages.TEXT_LANG.TITLE}
        actionButtons={[documentationActionButton]}
      >
        <ViewStateMachine
          error={error}
          loading={isLoading}
          loader={<ListSkeleton count={20} />}
        >
          <EntitiesSelection
            type="active"
            selectionKey="enabled-entities-settings"
            allList={entitiesList.data.map(({ value }) => value)}
            getEntityFieldLabels={getEntitiesDictionPlurals}
            hiddenList={entitiesToHide.data}
            onSubmit={upsertHideFromAppMutation.mutateAsync}
          />
        </ViewStateMachine>
      </SectionBox>
      <EnabledEntitiesDocumentation />
    </BaseSettingsLayout>
  );
}
