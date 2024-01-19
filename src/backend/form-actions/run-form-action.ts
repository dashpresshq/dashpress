import { DataEventActions } from "shared/types/data";
import { IAccountProfile } from "shared/types/user";
import { compileTemplateString } from "shared/lib/strings/templates";
import { getAppCredentialsAndConstants } from "backend/integrations-configurations/utils";
import { INTEGRATIONS_GROUP_CONFIG } from "shared/config-bag/integrations";
import { integrationsApiService } from "backend/integrations/integrations.service";
import { ACTION_INTEGRATIONS } from "../integrations/libs";
import { formActionsApiService } from "./form-actions.service";

export const runFormAction = async (
  entity: string,
  dataEventAction: DataEventActions,
  getData: () => Promise<Record<string, unknown>>,
  accountProfile: IAccountProfile
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

  for (const actionToRun of actionsToRun) {
    const { configuration, action, integration } = actionToRun;

    const actionConfiguration =
      await integrationsApiService.getIntegrationCredentials(integration);

    const connection = await ACTION_INTEGRATIONS[integration].connect(
      actionConfiguration
    );

    const compiledConfiguration = Object.fromEntries(
      Object.entries(configuration || {}).map(([key, value]) => [
        key,
        compileTemplateString(value, {
          data,
          [INTEGRATIONS_GROUP_CONFIG.constants.prefix]: appConstants,
          [INTEGRATIONS_GROUP_CONFIG.credentials.prefix]: credentials,
          auth: accountProfile,
        }),
      ])
    );

    await ACTION_INTEGRATIONS[integration].performsImplementation[action].do(
      connection,
      compiledConfiguration
    );
  }
};
