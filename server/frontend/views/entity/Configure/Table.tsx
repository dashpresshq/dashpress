import { ErrorAlert, SectionBox } from "@gothicgeeks/design-system";
import { useEntitySlug } from "../../../hooks/entity/entity.config";
import { NAVIGATION_LINKS } from "../../../lib/routing/links";
import { CreateEntityForm } from "../Create";
import { BaseEntitySettingsLayout } from "./_Base";

export const EntityTableSettings = () => {
  const entity = useEntitySlug();

  return (
    <BaseEntitySettingsLayout
      menuItem={{
        link: NAVIGATION_LINKS.ENTITY.CONFIG.TABLE(entity),
        name: "Table Settings",
      }}
    >
      <SectionBox title="Table Settings">
        <ErrorAlert message={"error"} />
        <CreateEntityForm
          onSubmit={() => {}}
          fields={[]}
          resetForm={false}
        />
      </SectionBox>
    </BaseEntitySettingsLayout>
  );
};
