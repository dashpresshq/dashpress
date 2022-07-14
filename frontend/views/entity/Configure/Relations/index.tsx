import {
  ErrorAlert,
  FormSkeleton,
  FormSkeletonSchema,
  SectionBox,
} from "@gothicgeeks/design-system";
import { useEntityFields } from "frontend/hooks/entity/entity.store";
import { SLUG_LOADING_VALUE } from "@gothicgeeks/shared";
import { useEntitySlug } from "../../../../hooks/entity/entity.config";
import { NAVIGATION_LINKS } from "../../../../lib/routing/links";
import { BaseEntitySettingsLayout } from "../_Base";
import {
  useEntityConfiguration,
  useUpsertConfigurationMutation,
} from "../../../../hooks/configuration/configration.store";
import { EntityRelationsForm } from "./Relations.form";
import { createViewStateMachine } from "../../useViewStateMachine";

export function EntityRelationsSettings() {
  const entity = useEntitySlug();
  const entityRelationFormat = useEntityConfiguration<{
    format: string;
  }>("relationship_settings", entity);
  const entityFields = useEntityFields(entity);

  const upsertConfigurationMutation = useUpsertConfigurationMutation(
    "relationship_settings",
    entity
  );

  const error = entityRelationFormat.error || entityFields.error;

  const isLoading =
    entityFields.isLoading ||
    entityRelationFormat.isLoading ||
    entity === SLUG_LOADING_VALUE;

  const viewStateMachine = createViewStateMachine(isLoading, error);

  return (
    <BaseEntitySettingsLayout
      menuItem={{
        link: NAVIGATION_LINKS.ENTITY.CONFIG.RELATIONS(entity),
        name: "Relationship Settings",
      }}
    >
      <SectionBox title="Relationship Settings">
        {viewStateMachine.type === "error" && (
          <ErrorAlert message={viewStateMachine.message} />
        )}
        {viewStateMachine.type === "loading" && (
          <FormSkeleton schema={[FormSkeletonSchema.Input]} />
        )}
        {viewStateMachine.type === "render" && (
          <EntityRelationsForm
            onSubmit={async (values) => {
              await upsertConfigurationMutation.mutateAsync(
                values as unknown as Record<string, string>
              );
            }}
            entityFields={(entityFields.data || []).map(({ name }) => name)}
            initialValues={entityRelationFormat.data}
          />
        )}
      </SectionBox>
    </BaseEntitySettingsLayout>
  );
}
