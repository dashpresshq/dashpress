import { ErrorAlert, SectionBox } from "@gothicgeeks/design-system";
import { useEntitySlug } from "../../../hooks/entity/entity.config";
import { NAVIGATION_LINKS } from "../../../lib/routing/links";
import { CreateEntityForm } from "../Create";
import { BaseEntitySettingsLayout } from "./_Base";

export const EntityUpdateSettings = () => {
  const entity = useEntitySlug();

  return (
    <BaseEntitySettingsLayout
      menuItem={{
        link: NAVIGATION_LINKS.ENTITY.CONFIG.CRUD(entity),
        name: "CRUD Settings",
      }}
    >
      <SectionBox title="CRUD Settings">
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
