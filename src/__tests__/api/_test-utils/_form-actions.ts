import { createConfigDomainPersistenceService } from "backend/lib/config-persistence";
import { ActionIntegrations, IFormAction } from "shared/types/actions";
import { DataEventActions } from "shared/types/data";

const TEST_FORM_ACTIONS: IFormAction[] = [
  {
    id: "form-action-id-1",
    integration: ActionIntegrations.SMTP,
    entity: "base-model",
    action: "SEND_MESSAGE",
    trigger: DataEventActions.Create,
    configuration: {
      foo: "bar",
    },
  },
  {
    id: "form-action-id-2",
    integration: ActionIntegrations.HTTP,
    entity: "secondary-model",
    action: "POST",
    trigger: DataEventActions.Delete,
    configuration: {
      bar: "foo",
    },
  },
];

export const setupFormActionsTestData = async (
  formActions: IFormAction[] = TEST_FORM_ACTIONS
) => {
  const configPersistenceService =
    createConfigDomainPersistenceService<IFormAction>("form-actions");

  await configPersistenceService.resetState("id", formActions);
};
