import { ErrorAlert, SectionBox } from "@gothicgeeks/design-system";
import { useEntitySlug } from "../../../hooks/entity/entity.config";
import { NAVIGATION_LINKS } from "../../../lib/routing/links";
import { CreateEntityForm } from "../Create";
import { BaseEntitySettingsLayout } from "./_Base";

export const EntityActionsSettings = () => {
  const entity = useEntitySlug();

  return (
    <BaseEntitySettingsLayout
      menuItem={{
        link: NAVIGATION_LINKS.ENTITY.CONFIG.ACTIONS(entity),
        name: "Actions Settings",
      }}
    >
      <SectionBox title="Actions Settings">
        <ErrorAlert message={"error"} />
        <CreateEntityForm onSubmit={() => {}} fields={[]} />
      </SectionBox>
    </BaseEntitySettingsLayout>
  );
};
