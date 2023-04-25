import { ListSkeleton, SectionBox, Typo } from "@hadmean/chromista";
import { useSetPageDetails } from "frontend/lib/routing";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
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

  useSetPageDetails({
    pageTitle: "Entities Settings",
    viewKey: SETTINGS_VIEW_KEY,
    permission: USER_PERMISSIONS.CAN_CONFIGURE_APP,
  });

  const entitiesToHide = useAppConfiguration<string[]>("disabled_entities");

  const upsertHideFromAppMutation = useUpsertConfigurationMutation(
    "disabled_entities",
    "",
    {
      otherEndpoints: [ACTIVE_ENTITIES_ENDPOINT, USER_MENU_ENTITIES_ENDPOINT],
    }
  );

  const getEntitiesDictionPlurals = useEntityDictionPlurals(
    entitiesList.data || [],
    "value"
  );

  const error = entitiesList.error || entitiesToHide.error;

  const isLoading = entitiesList.isLoading || entitiesToHide.isLoading;

  return (
    <BaseSettingsLayout>
      <SectionBox title="Entities Settings">
        <Typo.SM textStyle="italic">
          Disabling an entity here means it will not show anywhere on this
          application and any request made to it will result in a 404 response.
          This is a good place to toogle off entities related migrations, logs,
          or any other entities not related to your admin application.
        </Typo.SM>
        <ViewStateMachine
          error={error}
          loading={isLoading}
          loader={<ListSkeleton count={20} />}
        >
          <EntitiesSelection
            selectionKey="enabled-entities-settings"
            allList={(entitiesList.data || []).map(({ value }) => value)}
            getEntityFieldLabels={getEntitiesDictionPlurals}
            hiddenList={entitiesToHide.data || []}
            onSubmit={async (data) => {
              await upsertHideFromAppMutation.mutateAsync(data);
            }}
          />
        </ViewStateMachine>
      </SectionBox>
    </BaseSettingsLayout>
  );
}
