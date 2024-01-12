import { createConfigDomainPersistenceService } from "backend/lib/config-persistence";
import { ActionIntegrations, IActionInstance } from "shared/types/actions";
import { DataEventActions } from "shared/types/data";

const TEST_ACTION_INSTANCES: IActionInstance[] = [
  {
    instanceId: "instance-id-1",
    integration: ActionIntegrations.SMTP,
    entity: "base-model",
    action: "SEND_MESSAGE",
    trigger: DataEventActions.Create,
    configuration: {
      foo: "bar",
    },
  },
  {
    instanceId: "instance-id-2",
    integration: ActionIntegrations.HTTP,
    entity: "secondary-model",
    action: "POST",
    trigger: DataEventActions.Delete,
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
