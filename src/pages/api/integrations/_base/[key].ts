import { USER_PERMISSIONS } from "shared/constants/user";
import { requestHandler } from "backend/lib/request";
import { integrationsConfigurationController } from "backend/integrations-configurations/integrations-configurations.controller";
import { IAppliedSchemaFormConfig } from "shared/form-schemas/types";
import { IntegrationsConfigurationGroup } from "shared/types/integrations";

const REQUEST_KEY_FIELD = "key";

type IUpdateIntegrationValueForm = {
  value: string;
};

export const UPSERT_INTEGRATION_VALUE_FORM_SCHEMA: IAppliedSchemaFormConfig<IUpdateIntegrationValueForm> =
  {
    value: {
      type: "text",
      validations: [
        {
          validationType: "required",
        },
      ],
    },
  };

export const integrationsConfigurationDetailsRequestHandler = (
  group: IntegrationsConfigurationGroup
) => {
  return requestHandler(
    {
      PUT: async (getValidatedRequest) => {
        const validatedRequest = await getValidatedRequest([
          {
            _type: "requestQuery",
            options: REQUEST_KEY_FIELD,
          },
          {
            _type: "requestBody",
            options: UPSERT_INTEGRATION_VALUE_FORM_SCHEMA,
          },
        ]);
        return await integrationsConfigurationController.upsert(
          group,
          validatedRequest.requestQuery,
          validatedRequest.requestBody
        );
      },
      DELETE: async (getValidatedRequest) => {
        const validatedRequest = await getValidatedRequest([
          {
            _type: "requestQuery",
            options: REQUEST_KEY_FIELD,
          },
        ]);
        return await integrationsConfigurationController.delete(
          group,
          validatedRequest.requestQuery
        );
      },
    },

    [
      {
        _type: "canUser",
        body:
          group === IntegrationsConfigurationGroup.Credentials
            ? USER_PERMISSIONS.CAN_MANAGE_INTEGRATIONS
            : USER_PERMISSIONS.CAN_CONFIGURE_APP,
      },
    ]
  );
};
