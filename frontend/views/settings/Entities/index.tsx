import { ErrorAlert, SectionBox, Tabs } from "@gothicgeeks/design-system";
import {
  useAppConfiguration,
  useUpsertConfigurationMutation,
} from "../../../hooks/configuration/configration.store";
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

  return (
    <BaseSettingsLayout
      menuItem={{
        link: NAVIGATION_LINKS.SETTINGS.ENTITIES,
        name: "Entities Settings",
      }}
    >
      <ErrorAlert message={entitiesList.error} />
      <SectionBox title="Fields Settings">
        <Tabs
          // TODO add default tab
          contents={[
            {
              content: (
                <EntitiesSelection
                  description="Toggle the Entitites that you want on the menu"
                  isLoading={entitiesList.isLoading || entitiesToHide.isLoading}
                  allList={entitiesList.data || []}
                  getEntityFieldLabels={(input) => {
                    return input;
                  }}
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
