import type { IAppliedSchemaFormConfig } from "shared/form-schemas/types";
import type { IActionIntegrationsImplemention } from "shared/types/actions";
import { createTransport } from "nodemailer";
import { msg } from "@lingui/macro";
import { SEND_MAIL } from "./sendMail";
import type { IActionConfig } from "./types";

const CONFIGURATION_SCHEMA: IAppliedSchemaFormConfig<IActionConfig> = {
  host: {
    label: msg`Host`,
    type: "text",
    validations: [
      {
        validationType: "required",
      },
    ],
  },
  port: {
    label: msg`Port`,
    type: "number",
    validations: [
      {
        validationType: "required",
      },
    ],
  },
  authUser: {
    label: msg`User`,
    type: "text",
    validations: [
      {
        validationType: "required",
      },
    ],
  },
  authPassword: {
    label: msg`Password`,
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
