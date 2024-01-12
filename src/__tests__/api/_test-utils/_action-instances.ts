import { createConfigDomainPersistenceService } from "backend/lib/config-persistence";
import { ActionIntegrationKeys, IActionInstance } from "shared/types/actions";
import { DataEventActions } from "shared/types/data";

const TEST_ACTION_INSTANCES: IActionInstance[] = [
  {
    instanceId: "instance-id-1",
    integrationKey: ActionIntegrationKeys.SMTP,
    entity: "base-model",
    implementationKey: "SEND_MESSAGE",
    formAction: DataEventActions.Create,
    configuration: {
      foo: "bar",
    },
  },
  {
    instanceId: "instance-id-2",
    integrationKey: ActionIntegrationKeys.HTTP,
    entity: "secondary-model",
    implementationKey: "POST",
    formAction: DataEventActions.Delete,
    configuration: {
      bar: "foo",
    },
  },
];

export const setupActionInstanceTestData = async (
  testActionInstances: IActionInstance[] = TEST_ACTION_INSTANCES
) => {
  const configPersistenceService =
    createConfigDomainPersistenceService<IActionInstance>("action-instances");

  await configPersistenceService.resetState("instanceId", testActionInstances);
};
