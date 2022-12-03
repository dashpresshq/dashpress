import { IAppliedSchemaFormConfig } from "shared/form-schemas/types";
import { IActionIntegrationsImplemention } from "shared/types/actions";
import { SEND_MAIL } from "./sendMail";
import { IActionConfig } from "./types";

export const CONFIGURATION_SCHEMA: IAppliedSchemaFormConfig<IActionConfig> = {
  host: {
    type: "text",
    validations: [
      {
        validationType: "required",
      },
    ],
  },
  port: {
    type: "number",
    validations: [
      {
        validationType: "required",
      },
    ],
  },
  secure: {
    type: "boolean",
    validations: [],
  },
  authUser: {
    type: "text",
    validations: [
      {
        validationType: "required",
      },
    ],
  },
  authPassword: {
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
  defaultSenderAddress: {
    type: "text",
    validations: [],
  },
};

export const SMTP_ACTION_INTEGRATION: IActionIntegrationsImplemention = {
  title: "SMTP",
  description: "Send emails through SMTP",
  configurationSchema: CONFIGURATION_SCHEMA,
  connect: async (config: IActionConfig) => {
    return config;
  },
  performsImplementation: {
    SEND_MAIL,
  },
};
