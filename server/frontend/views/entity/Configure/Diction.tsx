import { ErrorAlert, SectionBox } from "@gothicgeeks/design-system";
import { useEntitySlug } from "../../../hooks/entity/entity.config";
import { NAVIGATION_LINKS } from "../../../lib/routing/links";
import { CreateEntityForm } from "../Create";
import { BaseEntitySettingsLayout } from "./_Base";

export const EntityDictionSettings = () => {
  const entity = useEntitySlug();

  return (
    <BaseEntitySettingsLayout
      menuItem={{
        link: NAVIGATION_LINKS.ENTITY.CONFIG.DICTION(entity),
        name: "Diction Settings",
      }}
    >
      <SectionBox title="Diction Settings">
        <ErrorAlert message={"error"} />
        <CreateEntityForm
          onSubmit={() => {}}
          fields={[]}
          isMakingRequest={false}
          resetForm={false}
        />
      </SectionBox>
    </BaseEntitySettingsLayout>
  );
};
