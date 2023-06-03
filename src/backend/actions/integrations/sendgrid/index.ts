import { IAppliedSchemaFormConfig } from "shared/form-schemas/types";
import { IActionIntegrationsImplemention } from "shared/types/actions";
import { SEND_MAIL } from "./sendMail";
import { IActionConfig } from "./types";

const CONFIGURATION_SCHEMA: IAppliedSchemaFormConfig<IActionConfig> = {
  apiKey: {
    type: "text",
    validations: [
      {
        validationType: "required",
      },
    ],
  },
  defaultSenderName: {
    type: "text",
    validations: [],
  },
  defaultSenderEmail: {
    type: "text",
    validations: [],
  },
};

export const SEND_GRID_ACTION_INTEGRATION: IActionIntegrationsImplemention = {
  title: "SendGrid",
  credentialsKey: "SENDGRID",
  description: "Send emails through SendGrid",
  configurationSchema: CONFIGURATION_SCHEMA,
  connect: async (config: IActionConfig) => config,
  performsImplementation: {
    SEND_MAIL,
  },
};
