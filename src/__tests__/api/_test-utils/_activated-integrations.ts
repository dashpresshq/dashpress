import { createKeyValueDomainPersistenceService } from "backend/lib/key-value";
import { ActionIntegrationKeys } from "shared/types/actions";

const TEST_ACTIVATED_ACTIONS: ActionIntegrationKeys[] = [
  ActionIntegrationKeys.SMTP,
  ActionIntegrationKeys.SLACK,
];

export const setupActivatedIntegrationsTestData = async (
  testActivatedActions: ActionIntegrationKeys[] = TEST_ACTIVATED_ACTIONS
) => {
  const activatedIntegrationsPersistenceService =
    createKeyValueDomainPersistenceService<ActionIntegrationKeys[]>(
      "activated-integrations"
    );

  await activatedIntegrationsPersistenceService.persistItem(
    testActivatedActions
  );
};
