import { USER_PERMISSIONS } from "shared/constants/user";
import { requestHandler } from "backend/lib/request";
import { integrationsConfigurationApiController } from "backend/integrations-configurations/integrations-configurations.controller";
import { IAppliedSchemaFormConfig } from "shared/form-schemas/types";
import { IntegrationsConfigurationGroup } from "shared/types/integrations";
import { ValidationKeys } from "backend/lib/request/validations/types";

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

const checks = (group: IntegrationsConfigurationGroup): ValidationKeys[] => {
  const baseChecks: ValidationKeys[] = [
    {
      _type: "canUser",
      body:
        group === IntegrationsConfigurationGroup.Credentials
          ? USER_PERMISSIONS.CAN_MANAGE_INTEGRATIONS
          : USER_PERMISSIONS.CAN_CONFIGURE_APP,
    },
  ];

  if (group === IntegrationsConfigurationGroup.Credentials) {
    baseChecks.push({
      _type: "withPassword",
    });
  }

  return baseChecks;
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
        return await integrationsConfigurationApiController.upsert(
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
        return await integrationsConfigurationApiController.delete(
          group,
          validatedRequest.requestQuery
        );
      },
    },

    checks(group)
  );
};
