import { integrationsApiService } from "backend/integrations/integrations.service";
import { getAppCredentialsAndConstants } from "backend/integrations-configurations/utils";
import { usersApiService } from "backend/users/users.service";
import { INTEGRATIONS_GROUP_CONFIG } from "shared/config-bag/integrations";
import { typescriptSafeObjectDotEntries } from "shared/lib/objects";
import { compileTemplateString } from "shared/lib/strings/templates";
import type { DataEventActions } from "shared/types/data";
import type { IAccountProfile } from "shared/types/user";

import { ACTION_INTEGRATIONS } from "../integrations/libs";
import { formActionsApiService } from "./form-actions.service";

export const runFormAction = async (
  entity: string,
  dataEventAction: DataEventActions,
  getData: () => Promise<Record<string, unknown>>,
  authProfile: IAccountProfile
) => {
  const formActions = await formActionsApiService.listEntityFormActions(entity);
  const actionsToRun = formActions.filter(
    (action) => action.trigger === dataEventAction
  );

  if (actionsToRun.length === 0) {
    return;
  }

  const data = await getData();

  const { appConstants, credentials } = await getAppCredentialsAndConstants();

  const auth = await usersApiService.getUserDatabaseLinkedInfo(authProfile);

  for (const actionToRun of actionsToRun) {
    const { configuration, action, integration } = actionToRun;

    const actionConfiguration =
      await integrationsApiService.getIntegrationCredentials(integration);

    const connection = await ACTION_INTEGRATIONS[integration].connect(
      actionConfiguration
    );

    const compiledConfiguration = Object.fromEntries(
      typescriptSafeObjectDotEntries(configuration || {}).map(
        ([key, value]) => [
          key,
          compileTemplateString(value, {
            data,
            [INTEGRATIONS_GROUP_CONFIG.constants.prefix]: appConstants,
            [INTEGRATIONS_GROUP_CONFIG.credentials.prefix]: credentials,
            auth,
          }),
        ]
      )
    );

    await ACTION_INTEGRATIONS[integration].performsImplementation[action].do(
      connection,
      compiledConfiguration
    );
  }
};
