import { IAppliedSchemaFormConfig } from "shared/form-schemas/types";
import { IActionIntegrationsImplemention } from "shared/types/actions";
import { SEND_MAIL } from "./sendMessage";
import { IActionConfig } from "./types";

export const CONFIGURATION_SCHEMA: IAppliedSchemaFormConfig<IActionConfig> = {
  apiKey: {
    type: "text",
    validations: [
      {
        validationType: "required",
      },
    ],
  },
  domain: {
    type: "text",
    validations: [
      {
        validationType: "required",
      },
    ],
  },
};

export const MAIL_GUN_ACTION_INTEGRATION: IActionIntegrationsImplemention = {
  title: "Mail Gun",
  description: "Send emails through Mailgun",
  configurationSchema: CONFIGURATION_SCHEMA,
  connect: async (config: IActionConfig) => config,
  performsImplementation: {
    SEND_MAIL,
  },
};
