import { IAppliedSchemaFormConfig } from "shared/form-schemas/types";
import { IActionIntegrationsImplemention } from "shared/types/actions";
import { createTransport } from "nodemailer";
import { SEND_MAIL } from "./sendMail";
import { IActionConfig } from "./types";

const CONFIGURATION_SCHEMA: IAppliedSchemaFormConfig<IActionConfig> = {
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
};

export const SMTP_ACTION_INTEGRATION: IActionIntegrationsImplemention = {
  title: "SMTP",
  credentialsKey: "SMTP",
  description: "Send emails through SMTP",
  configurationSchema: CONFIGURATION_SCHEMA,
  connect: async (config: IActionConfig) => {
    return [
      createTransport({
        host: config.host,
        port: config.port,
        secure: `${config.port}` === "465",
        auth: {
          user: config.authUser,
          pass: config.authPassword,
        },
      }),
      config,
    ];
  },
  performsImplementation: {
    SEND_MAIL,
  },
};
