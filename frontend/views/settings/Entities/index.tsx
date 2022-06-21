import { ErrorAlert, SectionBox, Tabs } from "@gothicgeeks/design-system";
import {
  useAppConfiguration,
  useUpsertConfigurationMutation,
} from "../../../hooks/configuration/configration.store";
import { useEntityDictionPlurals } from "../../../hooks/entity/entity.queries";
import {
  ENTITIES_MENU_ENDPOINT,
  useEntitiesList,
} from "../../../hooks/entity/entity.store";
import { NAVIGATION_LINKS } from "../../../lib/routing/links";
import { BaseSettingsLayout } from ".././_Base";
import { EntitiesSelection } from "./Selection";

export const EntitiesSettings = () => {
  const entitiesList = useEntitiesList();
  const entitiesToHide = useAppConfiguration<string[]>(
    "entities_to_hide_from_menu"
  );
  const upsertHideFromMenuMutation = useUpsertConfigurationMutation(
    "entities_to_hide_from_menu",
    "",
    { otherEndpoints: [ENTITIES_MENU_ENDPOINT] }
  );

  const entitiesDictionPlurals = useEntityDictionPlurals(entitiesList.data || [], 'value');

  return (
    <BaseSettingsLayout
      menuItem={{
        link: NAVIGATION_LINKS.SETTINGS.ENTITIES,
        name: "Entities Settings",
      }}
    >
      <ErrorAlert message={entitiesList.error || entitiesToHide.error} />
      <SectionBox title="Entities Settings">
        <Tabs
          // TODO add default tab
          contents={[
            {
              content: (
                <EntitiesSelection
                  description="Select the entitites that you want on to appear in the app i.e Tables, Home Page, Charts etc"
                  isLoading={entitiesList.isLoading || entitiesToHide.isLoading}
                  allList={entitiesList.data || []}
                  getEntityFieldLabels={entitiesDictionPlurals}
                  hiddenList={entitiesToHide.data || []}
                  onSubmit={(data) =>
                    upsertHideFromMenuMutation.mutateAsync(data)
                  }
                />
              ),
              label: "Menu Entities",
            },
            {
              content: (
                <>TODO</>
                //   <FieldsLabelForm
                //     initialValues={entityFieldLabelsMap.data}
                //     fields={entityScalarFields.data || []}
                //     onSubmit={upsertEntityFieldsMapMutation.mutateAsync}
                //   />
              ),
              label: "Order",
            },
          ]}
        />
      </SectionBox>
    </BaseSettingsLayout>
  );
};
