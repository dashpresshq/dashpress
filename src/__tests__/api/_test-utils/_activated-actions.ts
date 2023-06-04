import { createConfigDomainPersistenceService } from "backend/lib/config-persistence";
import { ActionIntegrationKeys, IActivatedAction } from "shared/types/actions";

const TEST_ACTIVATED_ACTIONS: IActivatedAction[] = [
  {
    activationId: "smtp-activation-id-1",
    integrationKey: ActionIntegrationKeys.SMTP,
    credentialsGroupKey: "SMTP",
  },
  {
    activationId: "slack-activation-id-2",
    integrationKey: ActionIntegrationKeys.SLACK,
    credentialsGroupKey: "SLACK",
  },
];

export const setupActivatedActionTestData = async (
  testActivatedActions: IActivatedAction[] = TEST_ACTIVATED_ACTIONS
) => {
  const configPersistenceService =
    createConfigDomainPersistenceService<IActivatedAction>("activated-actions");

  await configPersistenceService.resetState(
    "activationId",
    testActivatedActions
  );
};
