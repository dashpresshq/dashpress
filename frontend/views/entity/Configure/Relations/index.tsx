import { SectionBox } from "@gothicgeeks/design-system";
import { useEntitySlug } from "../../../../hooks/entity/entity.config";
import { NAVIGATION_LINKS } from "../../../../lib/routing/links";
import { BaseEntitySettingsLayout } from "../_Base";
import {
  useEntityConfiguration,
  useUpsertConfigurationMutation,
} from "../../../../hooks/configuration/configration.store";
import { EntityRelationsForm } from "./Relations.form";

export function EntityRelationsSettings() {
  const entity = useEntitySlug();
  const entityRelationFormat = useEntityConfiguration<{
    format: string;
  }>("relationship_settings", entity);

  const upsertConfigurationMutation = useUpsertConfigurationMutation(
    "relationship_settings",
    entity
  );
  return (
    <BaseEntitySettingsLayout
      menuItem={{
        link: NAVIGATION_LINKS.ENTITY.CONFIG.RELATIONS(entity),
        name: "Relationship Settings",
      }}
    >
      <SectionBox title="Relationship Settings">
        <EntityRelationsForm
          onSubmit={async (values) => {
            await upsertConfigurationMutation.mutateAsync(
              values as unknown as Record<string, string>
            );
          }}
          initialValues={entityRelationFormat.data}
        />
      </SectionBox>
    </BaseEntitySettingsLayout>
  );
}
