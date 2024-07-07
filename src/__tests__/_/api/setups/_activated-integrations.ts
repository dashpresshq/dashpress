import { createKeyValueDomainPersistenceService } from "@/backend/lib/key-value";
import { ActionIntegrations } from "@/shared/types/actions";

const TEST_ACTIVATED_ACTIONS: ActionIntegrations[] = [
  ActionIntegrations.SMTP,
  ActionIntegrations.SLACK,
];

export const setupActivatedIntegrationsTestData = async (
  testActivatedIntegrations: ActionIntegrations[] = TEST_ACTIVATED_ACTIONS
) => {
  const activatedIntegrationsPersistenceService =
    createKeyValueDomainPersistenceService<ActionIntegrations[]>(
      "activated-integrations"
    );

  await activatedIntegrationsPersistenceService.persistItem(
    testActivatedIntegrations
  );
};
