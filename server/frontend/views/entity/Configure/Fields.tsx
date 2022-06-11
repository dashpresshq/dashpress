import { ErrorAlert, SectionBox } from "@gothicgeeks/design-system";
import { useEntitySlug } from "../../../hooks/entity/entity.config";
import { NAVIGATION_LINKS } from "../../../lib/routing/links";
import { CreateEntityForm } from "../Create";
import { BaseEntitySettingsLayout } from "./_Base";

export const EntityFieldsSettings = () => {
  const entity = useEntitySlug();

  return (
    <BaseEntitySettingsLayout
      menuItem={{
        link: NAVIGATION_LINKS.ENTITY.CONFIG.FIELDS(entity),
        name: "Fields Settings",
      }}
    >
      <SectionBox title="Fields Settings">
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
