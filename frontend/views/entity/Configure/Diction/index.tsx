import {
  FormSkeleton,
  FormSkeletonSchema,
  SectionBox,
} from "@gothicgeeks/design-system";
import { SLUG_LOADING_VALUE } from "@gothicgeeks/shared";
import { useSetPageTitle } from "frontend/lib/routing/useGoBackContext";
import {
  useEntityDiction,
  useEntitySlug,
} from "../../../../hooks/entity/entity.config";
import { BaseEntitySettingsLayout } from "../_Base";
import { useUpsertConfigurationMutation } from "../../../../hooks/configuration/configration.store";
import { EntityDictionForm } from "./Form";
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
  useSetPageTitle("Diction Settings");
  return (
    <BaseEntitySettingsLayout>
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
