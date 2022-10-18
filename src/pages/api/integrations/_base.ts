import { USER_PERMISSIONS } from "shared/types";
import { requestHandler } from "backend/lib/request";
import {
  integrationsConfigurationController,
  IntegrationsConfigurationGroup,
} from "backend/integrations-configurations/integrations-configurations.controller";

export const integrationsConfigurationListRequestHandler = (
  group: IntegrationsConfigurationGroup
) => {
  return requestHandler(
    {
      GET: async () => {
        return await integrationsConfigurationController.list(group);
      },
    },
    group === IntegrationsConfigurationGroup.Credentials
      ? [
          {
            _type: "canUser",
            body: USER_PERMISSIONS.CAN_MANAGE_CREDENTIALS,
          },
        ]
      : undefined
  );
};

export const integrationsConfigurationDetailsRequestHandler = (
  group: IntegrationsConfigurationGroup
) => {
  return requestHandler(
    {
      PUT: async () => {
        return await integrationsConfigurationController.list(group);
      },
      DELETE: async () => {
        return await integrationsConfigurationController.list(group);
      },
    },

    [
      {
        _type: "canUser",
        body:
          group === IntegrationsConfigurationGroup.Credentials
            ? USER_PERMISSIONS.CAN_MANAGE_CREDENTIALS
            : USER_PERMISSIONS.CAN_CONFIGURE_APP,
      },
    ]
  );
};
