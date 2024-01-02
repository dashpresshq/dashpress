import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { USER_PERMISSIONS } from "shared/constants/user";
import { ILabelValue } from "shared/types/options";
import { MAKE_APP_CONFIGURATION_CRUD_CONFIG } from "frontend/hooks/configuration/configuration.constant";
import { useState } from "react";
import { DOCUMENTATION_LABEL } from "frontend/docs";
import { EnabledEntitiesDocumentation } from "frontend/docs/enabled-entities";
import { useApi } from "frontend/lib/data/useApi";
import { ListSkeleton } from "frontend/design-system/components/Skeleton/List";
import { SectionBox } from "frontend/design-system/components/Section/SectionBox";
import {
  useAppConfiguration,
  useUpsertConfigurationMutation,
} from "frontend/hooks/configuration/configuration.store";
import { useEntityDictionPlurals } from "frontend/hooks/entity/entity.queries";
import { ACTIVE_ENTITIES_ENDPOINT } from "frontend/hooks/entity/entity.store";
import { NAVIGATION_MENU_ENDPOINT } from "frontend/_layouts/app/LayoutImpl/constants";
import { SETTINGS_VIEW_KEY } from "../constants";
import { BaseSettingsLayout } from "../_Base";
import { EntitiesSelection } from "./Selection";

const CRUD_CONFIG = MAKE_APP_CONFIGURATION_CRUD_CONFIG("disabled_entities");

const DOCS_TITLE = "Enabled Entities";

const useEntitiesList = () =>
  useApi<ILabelValue[]>("/api/entities/list", {
    errorMessage: CRUD_CONFIG.TEXT_LANG.NOT_FOUND,
    defaultData: [],
  });

export function EntitiesSettings() {
  const entitiesList = useEntitiesList();

  useSetPageDetails({
    pageTitle: CRUD_CONFIG.TEXT_LANG.TITLE,
    viewKey: SETTINGS_VIEW_KEY,
    permission: USER_PERMISSIONS.CAN_CONFIGURE_APP,
  });

  const [isDocOpen, setIsDocOpen] = useState(false);

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

  const error = entitiesList.error || entitiesToHide.error;

  const isLoading = entitiesList.isLoading || entitiesToHide.isLoading;

  return (
    <BaseSettingsLayout>
      <SectionBox
        title={CRUD_CONFIG.TEXT_LANG.TITLE}
        actionButtons={[
          {
            _type: "normal",
            action: () => setIsDocOpen(true),
            icon: "help",
            label: DOCUMENTATION_LABEL.CONCEPT(DOCS_TITLE),
          },
        ]}
      >
        <ViewStateMachine
          error={error}
          loading={isLoading}
          loader={<ListSkeleton count={20} />}
        >
          <EntitiesSelection
            type="active"
            crudConfig={CRUD_CONFIG}
            selectionKey="enabled-entities-settings"
            allList={entitiesList.data.map(({ value }) => value)}
            getEntityFieldLabels={getEntitiesDictionPlurals}
            hiddenList={entitiesToHide.data}
            onSubmit={upsertHideFromAppMutation.mutateAsync}
          />
        </ViewStateMachine>
      </SectionBox>
      <EnabledEntitiesDocumentation
        title={DOCS_TITLE}
        close={setIsDocOpen}
        isOpen={isDocOpen}
      />
    </BaseSettingsLayout>
  );
}
