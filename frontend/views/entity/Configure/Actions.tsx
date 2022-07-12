import { ErrorAlert, SectionBox } from "@gothicgeeks/design-system";
import { useEntitySlug } from "../../../hooks/entity/entity.config";
import { NAVIGATION_LINKS } from "../../../lib/routing/links";
import { BaseEntitySettingsLayout } from "./_Base";

export function EntityActionsSettings() {
  const entity = useEntitySlug();
  // entity is loadig
  return (
    <BaseEntitySettingsLayout
      menuItem={{
        link: NAVIGATION_LINKS.ENTITY.CONFIG.ACTIONS(entity),
        name: "Actions Settings",
      }}
    >
      <SectionBox title="Actions Settings">
        <ErrorAlert message="error" />
        TODO
      </SectionBox>
    </BaseEntitySettingsLayout>
  );
}
