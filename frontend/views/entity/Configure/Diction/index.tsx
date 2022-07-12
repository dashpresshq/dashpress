import {
  FormSkeleton,
  FormSkeletonSchema,
  SectionBox,
} from "@gothicgeeks/design-system";
import { SLUG_LOADING_VALUE } from "@gothicgeeks/shared";
import {
  useEntityDiction,
  useEntitySlug,
} from "../../../../hooks/entity/entity.config";
import { NAVIGATION_LINKS } from "../../../../lib/routing/links";
import { BaseEntitySettingsLayout } from "../_Base";
import { useUpsertConfigurationMutation } from "../../../../hooks/configuration/configration.store";
import { EntityDictionForm } from "./Diction.form";
import { createViewStateMachine } from "../../useViewStateMachine";

// TODO validate plurals are unique
export function EntityDictionSettings() {
  const entity = useEntitySlug();
  const entityDiction = useEntityDiction();
  const upsertConfigurationMutation = useUpsertConfigurationMutation(
    "entity_diction",
    entity
  );
  const viewStateMachine = createViewStateMachine(
    entity === SLUG_LOADING_VALUE,
    false
  );
  return (
    <BaseEntitySettingsLayout
      menuItem={{
        link: NAVIGATION_LINKS.ENTITY.CONFIG.DICTION(entity),
        name: "Diction Settings",
      }}
    >
      <SectionBox title="Diction Settings">
        {viewStateMachine.type === "loading" && (
          <FormSkeleton
            schema={[FormSkeletonSchema.Input, FormSkeletonSchema.Input]}
          />
        )}
        {viewStateMachine.type === "render" && (
          <EntityDictionForm
            onSubmit={async (values) => {
              await upsertConfigurationMutation.mutateAsync(
                values as unknown as Record<string, string>
              );
            }}
            initialValues={entityDiction}
          />
        )}
      </SectionBox>
    </BaseEntitySettingsLayout>
  );
}
