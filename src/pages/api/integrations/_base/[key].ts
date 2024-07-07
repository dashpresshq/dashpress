import { msg } from "@lingui/macro";

import { integrationsConfigurationApiController } from "@/backend/integrations-configurations/integrations-configurations.controller";
import { requestHandler } from "@/backend/lib/request";
import type { ValidationKeys } from "@/backend/lib/request/validations/types";
import { UserPermissions } from "@/shared/constants/user";
import type { IAppliedSchemaFormConfig } from "@/shared/form-schemas/types";
import { IntegrationsConfigurationGroup } from "@/shared/types/integrations";

const REQUEST_KEY_FIELD = "key";

type IUpdateIntegrationValueForm = {
  value: string;
};

export const UPSERT_INTEGRATION_VALUE_FORM_SCHEMA: IAppliedSchemaFormConfig<IUpdateIntegrationValueForm> =
  {
    value: {
      label: msg`Value`,
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
          ? UserPermissions.CAN_MANAGE_APP_CREDENTIALS
          : UserPermissions.CAN_CONFIGURE_APP,
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
